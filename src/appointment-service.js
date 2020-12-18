function startAppointment(appointmentId) {
    console.log(appointmentId)
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    }

    return fetch(`/appointments/${appointmentId}/start`, requestOptions)
    .then(response => response.text())
};

function endAppointment(appointmentId) {
    console.log(appointmentId)
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    }

    return fetch(`/appointments/${appointmentId}/end`, requestOptions)
    .then(response => response.text())
};

export {
    startAppointment,
    endAppointment
}