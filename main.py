import flask
import json

app = flask.Flask(__name__)

FILE = "data.json"

with open(FILE) as file:
    data = json.load(file)

def save_data():
    with open(FILE, "w") as file:
        json.dump(data, file)

@app.route("/")
def home():
    return flask.render_template("index.html")

@app.route("/data", methods=["GET"])
def get_data():
    return json.dumps(data)

@app.route("/add_item", methods=["POST"])
def post_add_item():
    r = json.loads(flask.request.data.decode("utf-8"))
    data[r["index"]]["list"].append(r["value"])
    save_data()
    return "success"

@app.route("/move_item", methods=["POST"])
def post_move_item():
    r = json.loads(flask.request.data.decode("utf-8"))
    l = data[r["list"]]["list"]
    l.insert(r["new_index"], l.pop(r["old_index"]))
    save_data()
    return "success"

@app.route("/add_list", methods=["POST"])
def post_add_list():
    r = json.loads(flask.request.data.decode("utf-8"))
    data.append({"name": r["name"], "list": []})
    save_data()
    return "success"

@app.route("/move_list", methods=["POST"])
def post_move_list():
    r = json.loads(flask.request.data.decode("utf-8"))
    data.insert(r["new_index"], data.pop(r["old_index"]))
    save_data()
    return "success"

@app.route("/remove_list", methods=["POST"])
def post_remove_list():
    r = json.loads(flask.request.data.decode("utf-8"))
    del data[r["index"]]
    save_data()
    return "success"

@app.route("/remove_item", methods=["POST"])
def post_remove_item():
    r = json.loads(flask.request.data.decode("utf-8"))
    del data[r["list_index"]]["list"][r["item_index"]]
    save_data()
    return "success"

@app.route("/rename_list", methods=["POST"])
def post_rename_list():
    r = json.loads(flask.request.data.decode("utf-8"))
    data[r["index"]]["name"] = r["name"]
    save_data()
    return "success"

@app.route("/rename_item", methods=["POST"])
def post_rename_item():
    r = json.loads(flask.request.data.decode("utf-8"))
    data[r["list_index"]]["list"][r["item_index"]] = r["name"]
    save_data()
    return "success"

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
