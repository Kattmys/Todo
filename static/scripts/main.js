function init() {
    update()
    // update_loop()
}

function update_loop() {
    update()
    setTimeout(update_loop, 1000 * 10)
}

function update() {
    console.log("Uppdaterar lista...")
    get("get", consume_data)
}

function consume_data(data) {
    console.log(data)

    data = JSON.parse(data)

    html = ""

    for (i=0; i<data.length; i++) {
        html += `<div class='list'>
                <h2 class="list_name">` + data[i]["name"] + `</h2>
                <div class='row'>
                <button onclick='on_list_move(-1, ` + i + `)'>Upp</button>
                <button onclick='on_list_move( 1, ` + i + `)'>Ner</button>
                <button onclick='on_add(`           + i + `)'>Lägg till</button>
                <button onclick='on_list_remove(`   + i + `)'>Ta bort lista</button>
                <button onclick='on_list_rename(`   + i + `)'>Byt namn</button>
                </div>
                <ul>`

        for (j=0; j<data[i]["list"].length; j++) {
            html += `<li class='row'><div>
                     <button onclick='on_item_move(-1, ` + i + ", " + j + `)'>Upp</button>` +
                    `<button onclick='on_item_move( 1, ` + i + ", " + j + `)'>Ner</button>` +
                    `<button onclick='on_item_remove(`   + i + ", " + j + `)'>Ta bort</button>` +
                    `<button onclick='on_item_rename(`   + i + ", " + j + `)'>Byt namn</button>` +
                    `</div><p class='item'>` +
                    data[i]["list"][j] +
                    "</p></li>"
        }

        html += "</div>"
    }
    
    document.getElementById("lists").innerHTML = html
}

function on_add(index) {
    value = prompt()
    if (value != null && value != "") {
        post(
            "add_item",
            JSON.stringify({
                "index": index,
                "value": value
            }),
            handle_response
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
        }),
        handle_response
    )
}

function on_add_list() {
    value = prompt()
    if (value != null && value != "") {
        post(
            "add_list",
            JSON.stringify({
                "name": value
            }),
            handle_response
        )
    }
}

function on_list_move(amount, index) {
    post(
        "move_list",
        JSON.stringify({
            "old_index": index,
            "new_index": index + amount
        }),
        handle_response
    )
}

function on_list_remove(index) {
    post(
        "remove_list",
        JSON.stringify({
            "index": index
        }),
        handle_response
    )
}

function on_item_remove(list_index, item_index) {
    post(
        "remove_item",
        JSON.stringify({
            "list_index": list_index,
            "item_index": item_index
        }),
        handle_response
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
            }),
            handle_response
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
            }),
            handle_response
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

function post(theUrl, data, callback) {
    theUrl = window.location.href + "/" + theUrl
    httpPostAsync(theUrl, data, callback)
}

function get(theUrl, callback) {
    theUrl = window.location.href + "/" + theUrl
    httpGetAsync(theUrl, callback)
}

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
