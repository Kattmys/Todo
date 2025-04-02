import flask
import json
import traceback
import datetime

app = flask.Flask(__name__)

FILE = "data.json"

with open(FILE) as file:
    data = json.load(file)

def save_data():
    with open(FILE, "w") as file:
        json.dump(data, file)

@app.route("/")
def home():
    return flask.render_template("index.html", data=data)

@app.route("/<lista>", methods=["GET"])
def lista(lista):
    return flask.render_template("lista.html", listor=data[lista])

@app.route("/<lista>/get", methods=["GET"])
def get(lista):
    return json.dumps(data[lista])

@app.route("/<lista>/<metod>", methods=["POST"])
def post(lista, metod):
    try:
        todo = data[lista]["lists"]
        r = json.loads(flask.request.data.decode("utf-8"))

        match metod:
            case "add_item":    todo[r["index"]]["list"].append(r["value"])
            case "add_list":    todo.append({"name": r["name"], "list": []})
            case "move_item":   todo[r["list"]]["list"].insert(r["new_index"], todo[r["list"]]["list"].pop(r["old_index"]))
            case "move_list":   todo.insert(r["new_index"], todo.pop(r["old_index"]))
            case "remove_item": del todo[r["list_index"]]["list"][r["item_index"]]
            case "remove_list": del todo[r["index"]]
            case "rename_item": todo[r["list_index"]]["list"][r["item_index"]] = r["name"]
            case "rename_list": todo[r["index"]]["name"] = r["name"]
            case _:
                return "unknown command"

        data[lista]["last_edited"] = datetime.datetime.now().isoformat(" ", "minutes")

        save_data()
        return "success"

    except Exception as e:
        return traceback.format_exception(e)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
