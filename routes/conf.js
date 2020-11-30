const channelARN = 'arn:aws:kinesisvideo:eu-central-1:948064287778:channel/test-channel/1234567890';
const channelName = 'test-channel';
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = 'eu-central-1';
const clientId = 'test-kinesis-client';
const sendVideo = true;
const sendAudio = false;
const useTrickleICE = true;

module.exports = {
    channelARN,
    channelName,
    accessKeyId,
    secretAccessKey,
    region,
    clientId,
    sendVideo,
    sendAudio,
    useTrickleICE
}