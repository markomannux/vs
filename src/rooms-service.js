export default function fetchRooms() {
    return fetch("http://localhost:3000/rooms", {
        "method": "GET",
        "headers": {
            "user-agent": "vscode-restclient",
            "accept": "application/json"
        }
    })
    .then(res => {
        return res.json();
    })
}