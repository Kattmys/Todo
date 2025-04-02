
function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function init() {
    update()
    // update_loop()
}

function update_loop() {
    update()
    setTimeout(update_loop, 1000 * 10)
}

function load_data(data) {
    document.getElementById("body").innerHTML = data
}

function update() {
    console.log("Uppdaterar lista...")
    httpGetAsync(window.location.href, load_data)
}

function on_add(index) {
    value = prompt()
    if (value != null && value != "") {
        post(
            "add_item",
            JSON.stringify({
                "index": index,
                "value": value
            })
        )
    }
}

function on_item_move(amount, list_index, item_index) {
    post(
        "move_item",
        JSON.stringify({
            "list":      list_index,
            "old_index": item_index,
            "new_index": item_index + amount
        })
    )
}

function on_add_list() {
    value = prompt()
    if (value != null && value != "") {
        post(
            "add_list",
            JSON.stringify({
                "name": value
            })
        )
    }
}

function on_list_move(amount, index) {
    post(
        "move_list",
        JSON.stringify({
            "old_index": index,
            "new_index": index + amount
        })
    )
}

function on_list_remove(index) {
    post(
        "remove_list",
        JSON.stringify({
            "index": index
        })
    )
}

function on_item_remove(list_index, item_index) {
    post(
        "remove_item",
        JSON.stringify({
            "list_index": list_index,
            "item_index": item_index
        })
    )
}

function on_list_rename(index) {
    value = prompt()
    if (value != null && value != "") {
        post(
            "rename_list",
            JSON.stringify({
                "index": index,
                "name": value
            })
        )
    }
}

function on_item_rename(list_index, item_index) {
    value = prompt()
    if (value != null && value != "") {
        post(
            "rename_item",
            JSON.stringify({
                "list_index": list_index,
                "item_index": item_index,
                "name": value
            })
        )
    }
}

function handle_response(response) {
    if (response == "success") {
        update()
    } else {
        console.log("Received error from server!")
        console.log(response)
    }
}

function post(theUrl, data) {
    theUrl = window.location.href + "/" + theUrl
    httpPostAsync(theUrl, data, handle_response)
}

// function get(theUrl, callback) {
//     theUrl = window.location.href + "/" + theUrl
//     httpGetAsync(theUrl, callback)
// }

// https://stackoverflow.com/questions/247483/http-get-request-in-javascript
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText)
    }
    xmlHttp.open("GET", theUrl, true) // true for asynchronous 
    xmlHttp.send(null)
}

// https://stackoverflow.com/questions/6396101/pure-javascript-send-post-data-without-a-form
function httpPostAsync(theUrl, data, callback) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText)
    }
    xmlHttp.open("POST", theUrl, true) // true for asynchronous 
    xmlHttp.send(data)
}
