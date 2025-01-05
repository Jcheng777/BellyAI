from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


# Routes
@app.route("/recommend/", methods=["POST"])
def recommend():
  """
  This endpoint takes in a users input and returns a recommended restaurant and a concise summary.
  It does a couple things:
  1. It queries the user input to the VectorDB, which returns a list of relevant restaurants
  2. It then sends the relevant restaurant info to OpenAI API which returns a summary
  """
  continue


if __name__ == "__main__":
    app.run(debug=True)