from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


# Routes
@app.route("/recommend", methods=["POST"])
def recommend():
  continue

if __name__ == "__main__":
    app.run(debug=True)