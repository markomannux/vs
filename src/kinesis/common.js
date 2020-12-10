export class ScreenSharingHandler {

    constructor(ctx) {
        this.ctx = ctx
    }

    async startScreenSharing(conf, switchTrack) {
        conf.widescreen = true
        this.ctx.screenSharingStream = await navigator.mediaDevices.getDisplayMedia(this.createConstraints(conf));
        this.ctx.localView.srcObject = this.ctx.screenSharingStream;
        const screenSharingTrack = this.ctx.screenSharingStream.getVideoTracks()[0]
        screenSharingTrack.addEventListener('ended', () => this.onScreenSharingEnded(switchTrack))
        switchTrack(screenSharingTrack)
    }

    onScreenSharingEnded(switchTrack) {
        // Switching back to webcam stream
        this.ctx.localView.srcObject = this.ctx.localStream;
        const webcamTrack = this.ctx.localStream.getVideoTracks()[0]
        switchTrack(webcamTrack)
    }

    createConstraints(conf) {
        const resolution = conf.widescreen ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } };
        const constraints = {
            video: conf.sendVideo ? resolution : false,
            audio: conf.sendAudio,
        };

        return constraints
    }

}