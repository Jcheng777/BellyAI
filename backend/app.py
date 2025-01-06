import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.rag import (
    initialize_pinecone,
    build_index,
    query_index,
    generate_summary
)
from services.config import (
  get_openai_api_key,
  get_pinecone_api_key
)

app = Flask(__name__)
CORS(app)

# Initalize variables
PINECONE_API_KEY = get_pinecone_api_key()
OPENAI_API_KEY = get_openai_api_key()

# This index has been made already - check RAG.ipnyb for more details
INDEX_NAME = "belly-ai"

# Initialize Pinecone and Storage Context
storage_context, pinecone_index = initialize_pinecone(PINECONE_API_KEY, INDEX_NAME)

# Build the index
index = build_index(storage_context)

# Routes
@app.route("/recommend/", methods=["POST"])
def recommend():
  """
  This endpoint takes in a users input and returns a recommended restaurant and a concise summary.
  It does a couple things:
  1. It queries the user input to the VectorDB, which returns a list of relevant restaurants
  2. It then sends the relevant restaurant info to OpenAI API which returns a summary
  """
  # Get the user input from the POST request
  body = json.loads(request.data)
  user_input = body.get("query")

  # Checks if user_input exists
  if not user_input:
    return jsonify({"error": "Query is required"}), 400
  
  # Query the VectorDB
  retrieved_docs = query_index(index, user_input)
  if not retrieved_docs:
    return jsonify({"error": "No retrieved documents available"}), 500
  
  # Business data to return to frontend 
  data = retrieved_docs[0].metadata

  # Generate summary 
  reviewsList = []
  for doc in retrieved_docs:
    id_of_first_biz = retrieved_docs[0].metadata.get("business_id", None)
    if not id_of_first_biz:
      return jsonify({"error": "Business ID is missing in the retrieved documents"}), 500

    if id_of_first_biz == doc.metadata.get("business_id"):
      reviewsList.append(doc.text)
  
  if not reviewsList:
    return jsonify({"error": "No reviews found for the first business"}), 500

  summary = generate_summary(user_input, reviewsList, OPENAI_API_KEY)
  data["summary"] = summary

  return jsonify(data), 200

if __name__ == "__main__":
    app.run(debug=True)