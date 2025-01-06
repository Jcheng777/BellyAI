from pinecone.grpc import PineconeGRPC
from pinecone import ServerlessSpec
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.core.retrievers import VectorIndexRetriever
from openai import OpenAI


def initialize_pinecone(api_key, index_name, dimension=1536):
    """
    Initialize Pinecone Vector DB and connect to the index or create new index.
    """
    pc = PineconeGRPC(api_key=api_key)
    pinecone_index = pc.Index(index_name)
    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    return storage_context, pinecone_index

def build_index(storage_context, documents=None):
    """
    Load an existing one.
    """
     # Retrieve the vector store from the storage context
    vector_store = storage_context.vector_store

    index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
    return index

def query_index(index, query, top_k=5):
    """
    Query the index for top-k results.
    """
    retriever = VectorIndexRetriever(index=index, similarity_top_k=top_k)
    retrieved_docs = retriever.retrieve(query)
    return retrieved_docs

def generate_summary(user_query, reviews, api_key):
  """Generate a summary for a restaurant using OpenAI API."""

  # Combine reviews into a single string with numbering
  numbered_reviews = "\n".join([f"{i+1}. {review}" for i, review in enumerate(reviews)])

  client = OpenAI(api_key=api_key)
  prompt = (
        f"Based on the following reviews, write a 2-3 sentence summary of the restaurant, "
        f"focusing on its most notable features relevant to the user query.\n\n"
        f"User query: {user_query}\n\n"
        f"Reviews:\n{numbered_reviews}\n\n"
        f"Provide a clear and concise summary."
    )  
  response = client.chat.completions.create(
        model="gpt-4o",  # Use the appropriate model for your use case
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes information."},
            {"role": "user", "content": prompt}
        ]
    )
  return response.choices[0].message.content.strip()