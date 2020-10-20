const handleWaitingListEvent = (data) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("/rooms/5f8b5499e2a9b173a2222a0f/fragments/waitingList", requestOptions)
    .then(response => response.text())
    .then(result => $('[data-behavior~=waiting-list]').html(result))
    .catch(error => console.log('error', error));
}

document.addEventListener('guest:waiting', handleWaitingListEvent);
document.addEventListener('guest:disconnect', handleWaitingListEvent);