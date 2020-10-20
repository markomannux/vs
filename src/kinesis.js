async function init() {

    console.log('Initializing room');

    const channelARN = 'arn:aws:kinesisvideo:eu-central-1:948064287778:channel/test-channel/1234567890';
    const accessKeyId = ACCESS_KEY_ID;
    const secretAccessKey = SECRET_ACCESS_KEY;
    const region = 'eu-central-1';
    const clientId = 'test-kinesis-client';

    AWS.config.region = region; 
    const localView = document.getElementsByTagName('video')[0];
    const remoteView = document.getElementsByTagName('video')[1];
    
    const kinesisVideoClient = new AWS.KinesisVideo({
        region,
        accessKeyId,
        secretAccessKey,
        correctClockSkew: true,
    });

    var params = {
      ChannelName: 'test-channel'
    };
    const channel = await kinesisVideoClient.describeSignalingChannel(params)
    .promise();

    console.log(channel)
    
    if (!channel) {
      var params = {
        ChannelName: 'test-channel', /* required */
        ChannelType: 'SINGLE_MASTER'
      };
      channel = await kinesisVideoClient.createSignalingChannel(params)
      .promise();
    }


    const getSignalingChannelEndpointResponse = await kinesisVideoClient
    .getSignalingChannelEndpoint({
        ChannelARN: channel.ChannelInfo.ChannelARN,
        SingleMasterChannelEndpointConfiguration: {
            Protocols: ['WSS', 'HTTPS'],
            Role: KVSWebRTC.Role.VIEWER,
        },
    })
    .promise();

    const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
        endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
        return endpoints;
    }, {});


    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
        region,
        accessKeyId,
        secretAccessKey,
        endpoint: endpointsByProtocol.HTTPS,
        correctClockSkew: true,
    });

    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
    .getIceServerConfig({
        ChannelARN: channelARN,
    })
    .promise();
    const iceServers = [
        { urls: `stun:stun.kinesisvideo.${region}.amazonaws.com:443` }
    ];
    getIceServerConfigResponse.IceServerList.forEach(iceServer =>
        iceServers.push({
            urls: iceServer.Uris,
            username: iceServer.Username,
            credential: iceServer.Password,
        }),
    );

    const peerConnection = new RTCPeerConnection({ iceServers });

    signalingClient = new KVSWebRTC.SignalingClient({
    channelARN,
    channelEndpoint: endpointsByProtocol.WSS,
    clientId,
    role: KVSWebRTC.Role.VIEWER,
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    systemClockOffset: kinesisVideoClient.config.systemClockOffset,
    });


    // Once the signaling channel connection is open, connect to the webcam and create an offer to send to the master
    signalingClient.on('open', async () => {
        // Get a stream from the webcam, add it to the peer connection, and display it in the local view
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: true,
            });
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            localView.srcObject = localStream;
        } catch (e) {
            // Could not find webcam
            return;
        }

        // Create an SDP offer and send it to the master
        const offer = await viewer.peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
        });
        await peerConnection.setLocalDescription(offer);
        signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
    });

    // When the SDP answer is received back from the master, add it to the peer connection.
    signalingClient.on('sdpAnswer', async answer => {
        await peerConnection.setRemoteDescription(answer);
    });

    // When an ICE candidate is received from the master, add it to the peer connection.
    signalingClient.on('iceCandidate', candidate => {
        peerConnection.addIceCandidate(candidate);
    });

    signalingClient.on('close', () => {
        // Handle client closures
    });

    signalingClient.on('error', error => {
        // Handle client errors
    });



    // Send any ICE candidates generated by the peer connection to the other peer
    peerConnection.addEventListener('icecandidate', ({ candidate }) => {
        if (candidate) {
            signalingClient.sendIceCandidate(candidate);
        } else {
            // No more ICE candidates will be generated
        }
    });

    // As remote tracks are received, add them to the remote view
    peerConnection.addEventListener('track', event => {
        if (remoteView.srcObject) {
            return;
        }
        remoteView.srcObject = event.streams[0];
    });


    signalingClient.open();
}

init();