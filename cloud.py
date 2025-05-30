from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)  # Enable CORS
load_dotenv()
00

UPLOAD_PASSWORD = os.getenv("UPLOAD_PASSWORD")  # fallback for testing
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER",)

@app.route('/auth', methods=['POST'])
def auth():
    if request.headers.get("X-Password") == UPLOAD_PASSWORD:
        return '', 200
    return jsonify({"error": "Unauthorized"}), 401

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.headers.get("X-Password") != UPLOAD_PASSWORD:
        return jsonify({"error": "Unauthorized"}), 401

    file = request.files.get('file')
    if file:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        return jsonify({"message": f"File uploaded: {file.filename}"}), 200
    return jsonify({"error": "No file provided"}), 400

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(host='0.0.0.0', port=5000)
