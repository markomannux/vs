var SigV4RequestSigner = require('amazon-kinesis-video-streams-webrtc').SigV4RequestSigner
var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

const conf = require('./conf')

router.get('/videoClientInfo', async (req, res, next) => {
   // Create KVS client
    const kinesisVideoClient = new AWS.KinesisVideo({
        region: conf.region,
        accessKeyId: conf.accessKeyId,
        secretAccessKey: conf.secretAccessKey,
        endpoint: conf.endpoint,
        correctClockSkew: true,
    });

    console.log('Video client created')

        // Get signaling channel ARN
    const describeSignalingChannelResponse = await kinesisVideoClient
        .describeSignalingChannel({
            ChannelName: conf.channelName,
        })
        .promise();
    const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;
    console.log('[MASTER] Channel ARN: ', channelARN);


    // Get signaling channel endpoints
    const getSignalingChannelEndpointResponse = await kinesisVideoClient
        .getSignalingChannelEndpoint({
            ChannelARN: channelARN,
            SingleMasterChannelEndpointConfiguration: {
                Protocols: ['WSS', 'HTTPS'],
                Role: req.query.role,
            },
        })
        .promise();
    const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
        endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
        return endpoints;
    }, {});
    console.log('[MASTER] Endpoints: ', endpointsByProtocol);

        // Get ICE server configuration
    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
        region: conf.region,
        accessKeyId: conf.accessKeyId,
        secretAccessKey: conf.secretAccessKey,
        sessionToken: conf.sessionToken,
        endpoint: endpointsByProtocol.HTTPS,
        correctClockSkew: true,
    });
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
        .getIceServerConfig({
            ChannelARN: channelARN,
        })
        .promise();
    const iceServers = [];
    if (!conf.natTraversalDisabled && !conf.forceTURN) {
        iceServers.push({ urls: `stun:stun.kinesisvideo.${conf.region}.amazonaws.com:443` });
    }
    if (!conf.natTraversalDisabled) {
        getIceServerConfigResponse.IceServerList.forEach(iceServer =>
            iceServers.push({
                urls: iceServer.Uris,
                username: iceServer.Username,
                credential: iceServer.Password,
            }),
        );
    }

    res.json({
        channelARN,
        endpointsByProtocol,
        systemClockOffset: kinesisVideoClient.config.systemClockOffset,
        iceServers
    })

})

router.get('/signedUrl', async (req, res, next) => {
    const region = conf.region
    const credentials = {
        accessKeyId: conf.accessKeyId,
        secretAccessKey: conf.secretAccessKey
    };
    const queryParams = req.query
    const signer = new SigV4RequestSigner(region, credentials);
    const url = await signer.getSignedURL(req.query.endpoint, queryParams);

    res.send(url)
})

module.exports = router;
