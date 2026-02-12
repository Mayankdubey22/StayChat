from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
from dotenv import load_dotenv
import os

# Loading environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client["staychat_db"]
collection = db["items"]


def serialize_item(item):
    return {
        "_id": str(item["_id"]),
        "name": item["name"],
        "description": item["description"],
        "timestamp": item["timestamp"],
    }


#Get all items
@app.route("/items", methods=["GET"])
def get_items():
    items = collection.find().sort("timestamp", -1)
    return jsonify([serialize_item(item) for item in items])


#Add new item
@app.route("/items", methods=["POST"])
def add_item():
    data = request.json

    item = {
        "name": data["name"],
        "description": data["description"],
        "timestamp": datetime.utcnow(),
    }

    result = collection.insert_one(item)
    item["_id"] = result.inserted_id

    return jsonify(serialize_item(item))


#Delete item
@app.route("/items/<id>", methods=["DELETE"])
def delete_item(id):
    collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Item deleted successfully"})


#Free Summarization Logic as for the openai we have to pay 
@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "Text required"}), 400

    sentences = text.split(".")
    summary = sentences[0]

    if len(summary) > 150:
        summary = summary[:150] + "..."

    return jsonify({"summary": summary.strip()})


if __name__ == "__main__":
    app.run(debug=True)
