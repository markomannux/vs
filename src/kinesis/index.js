import * as master from "./master";
import * as viewer from "./viewer";

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
});

$('#stop-master-button').on('click', async () => {
    master.stopMaster()
    $('#master-button').show()
    $('#stop-master-button').hide()
});

$('#viewer-button').on('click', async () => {
    const localView = $('video')[0];
    const remoteView = $('video')[1];

    viewer.startViewer(localView, remoteView, onStatsReport, event => {
        remoteMessage.append(`${event.data}\n`);
    });
});

$('#stop-viewer-button').on('click', viewer.stopViewer);