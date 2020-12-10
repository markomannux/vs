import * as master from "./master";

function onStatsReport(report) {
    // TODO: Publish stats
}

$('#master-button').on('click', async () => {
    const localView = $('video')[0];
    const remoteView = $('video')[1];

    await master.startMaster(localView, remoteView, onStatsReport, event => {
        remoteMessage.append(`${event.data}\n`);
    });

    $('#master-button').hide()
    $('#stop-master-button').show()
    $('#share-screen-master-button').show()
});

$('#stop-master-button').on('click', async () => {
    master.stopMaster()
    $('#master-button').show()
    $('#stop-master-button').hide()
    $('#share-screen-master-button').hide()
});

$('#share-screen-master-button').on('click', master.startScreenSharing)