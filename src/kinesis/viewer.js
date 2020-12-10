import * as conf from "./conf";
import {ScreenSharingHandler} from "./common"

/**
 * This file demonstrates the process of starting WebRTC streaming using a KVS Signaling Channel.
 */
const viewer = {};

export async function startViewer(localView, remoteView, onStatsReport, onRemoteDataMessage) {
    viewer.localView = localView;
    viewer.remoteView = remoteView;
    viewer.screenSharingHandler = new ScreenSharingHandler(viewer)

    const baseUrl = `${window.location.protocol}//${window.location.host}`

    let url = new URL('/signer/videoClientInfo', baseUrl)
    let params = {role: KVSWebRTC.Role.VIEWER}
    url.search = new URLSearchParams(params).toString(); 
    const vcInfo = await fetch(url).then(response => response.json())
    console.log('[VIEWER] Endpoints: ', vcInfo.endpointsByProtocol);


    // Create Signaling Client
    viewer.signalingClient = new KVSWebRTC.SignalingClient({
        channelARN: vcInfo.channelARN,
        channelEndpoint: vcInfo.endpointsByProtocol.WSS,
        clientId: conf.clientId,
        role: KVSWebRTC.Role.VIEWER,
        region: conf.region,
        requestSigner: {
            getSignedURL: async function(endpoint, queryParams, date) {
                let url = new URL('/signer/signedUrl', baseUrl)
                let params = {endpoint, ...queryParams}
                url.search = new URLSearchParams(params).toString(); 
                const response = await fetch(url)
                return response.text()
            }
        },
        systemClockOffset: vcInfo.systemClockOffset,
    });

    const iceServers = vcInfo.iceServers
    console.log('[VIEWER] ICE servers: ', iceServers);

    const configuration = {
        iceServers,
        iceTransportPolicy: conf.forceTURN ? 'relay' : 'all',
    };

    const resolution = conf.widescreen ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } };
    const constraints = {
        video: conf.sendVideo ? resolution : false,
        audio: conf.sendAudio,
    };
    viewer.peerConnection = new RTCPeerConnection(configuration);
    if (conf.openDataChannel) {
        viewer.dataChannel = viewer.peerConnection.createDataChannel('kvsDataChannel');
        viewer.peerConnection.ondatachannel = event => {
            event.channel.onmessage = onRemoteDataMessage;
        };
    }

    // Poll for connection stats
    viewer.peerConnectionStatsInterval = setInterval(() => viewer.peerConnection.getStats().then(onStatsReport), 1000);

    viewer.signalingClient.on('open', async () => {
        console.log('[VIEWER] Connected to signaling service');

        // Get a stream from the webcam, add it to the peer connection, and display it in the local view.
        // If no video/audio needed, no need to request for the sources. 
        // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
        if (conf.sendVideo || conf.sendAudio) {
            try {
                viewer.localStream = await navigator.mediaDevices.getUserMedia(constraints);

                const videoTrack = viewer.localStream.getVideoTracks()[0]
                if(videoTrack) {
                    viewer.videoSender = viewer.peerConnection.addTrack(videoTrack, viewer.localStream)
                }
                const audioTrack = viewer.localStream.getAudioTracks()[0]
                if(audioTrack) {
                    viewer.audioSender = viewer.peerConnection.addTrack(audioTrack, viewer.localStream)
                }
                //viewer.localStream.getTracks().forEach(track => viewer.peerConnection.addTrack(track, viewer.localStream));
                localView.srcObject = viewer.localStream;
            } catch (e) {
                console.error('[VIEWER] Could not find webcam');
                return;
            }
        }

        // Create an SDP offer to send to the master
        console.log('[VIEWER] Creating SDP offer');
        await viewer.peerConnection.setLocalDescription(
            await viewer.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            }),
        );

        // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
        if (conf.useTrickleICE) {
            console.log('[VIEWER] Sending SDP offer');
            viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
        }
        console.log('[VIEWER] Generating ICE candidates');
    });

    viewer.signalingClient.on('sdpAnswer', async answer => {
        // Add the SDP answer to the peer connection
        console.log('[VIEWER] Received SDP answer');
        await viewer.peerConnection.setRemoteDescription(answer);
    });

    viewer.signalingClient.on('iceCandidate', candidate => {
        // Add the ICE candidate received from the MASTER to the peer connection
        console.log('[VIEWER] Received ICE candidate');
        viewer.peerConnection.addIceCandidate(candidate);
    });

    viewer.signalingClient.on('close', () => {
        console.log('[VIEWER] Disconnected from signaling channel');
    });

    viewer.signalingClient.on('error', error => {
        console.error('[VIEWER] Signaling client error: ', error);
    });

    // Send any ICE candidates to the other peer
    viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
        if (candidate) {
            console.log('[VIEWER] Generated ICE candidate');

            // When trickle ICE is enabled, send the ICE candidates as they are generated.
            if (conf.useTrickleICE) {
                console.log('[VIEWER] Sending ICE candidate');
                viewer.signalingClient.sendIceCandidate(candidate);
            }
        } else {
            console.log('[VIEWER] All ICE candidates have been generated');

            // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
            if (!conf.useTrickleICE) {
                console.log('[VIEWER] Sending SDP offer');
                viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
            }
        }
    });
    
    // As remote tracks are received, add them to the remote view
    viewer.peerConnection.addEventListener('track', event => {
        console.log('[VIEWER] Received remote track');
        //if (remoteView.srcObject) {
        //    return;
        //}
        viewer.remoteStream = event.streams[0];
        remoteView.srcObject = null
        remoteView.srcObject = viewer.remoteStream;
    });

    viewer.signalingClient.on('sdpOffer', async offer => {
        // Add the SDP answer to the peer connection
        console.log('[VIEWER] Received SDP offer');
        await viewer.peerConnection.setRemoteDescription(offer);
        await viewer.peerConnection.setLocalDescription(
            await viewer.peerConnection.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            }),
        );
    })

    console.log('[VIEWER] Starting viewer connection');
    viewer.signalingClient.open();


}

export function stopViewer() {
    console.log('[VIEWER] Stopping viewer connection');
    if (viewer.signalingClient) {
        viewer.signalingClient.close();
        viewer.signalingClient = null;
    }

    if (viewer.peerConnection) {
        viewer.peerConnection.close();
        viewer.peerConnection = null;
    }

    if (viewer.localStream) {
        viewer.localStream.getTracks().forEach(track => track.stop());
        viewer.localStream = null;
    }

    if (viewer.remoteStream) {
        viewer.remoteStream.getTracks().forEach(track => track.stop());
        viewer.remoteStream = null;
    }

    if (viewer.peerConnectionStatsInterval) {
        clearInterval(viewer.peerConnectionStatsInterval);
        viewer.peerConnectionStatsInterval = null;
    }

    if (viewer.localView) {
        viewer.localView.srcObject = null;
    }

    if (viewer.remoteView) {
        viewer.remoteView.srcObject = null;
    }

    if (viewer.dataChannel) {
        viewer.dataChannel = null;
    }
}

export function sendViewerMessage(message) {
    if (viewer.dataChannel) {
        try {
            viewer.dataChannel.send(message);
        } catch (e) {
            console.error('[VIEWER] Send DataChannel: ', e.toString());
        }
    }
}

export async function startScreenSharing() {
    viewer.screenSharingHandler.startScreenSharing(conf, switchTrack)
}

function switchTrack(track) {
    if (viewer.videoSender) {
        viewer.videoSender.replaceTrack(track)
    }
}