import * as master from "./master";
import * as viewer from "./viewer";

function onStatsReport(report) {
    // TODO: Publish stats
}

$('#master-button').click(async () => {
    const localView = $('video')[0];
    const remoteView = $('video')[1];

    master.startMaster(localView, remoteView, onStatsReport, event => {
        remoteMessage.append(`${event.data}\n`);
    });
});

$('#stop-master-button').click(master.stopMaster);

$('#viewer-button').click(async () => {
    const localView = $('video')[0];
    const remoteView = $('video')[1];

    viewer.startViewer(localView, remoteView, onStatsReport, event => {
        remoteMessage.append(`${event.data}\n`);
    });
});

$('#stop-viewer-button').click(viewer.stopViewer);