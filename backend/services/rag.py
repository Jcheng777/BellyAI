from pinecone.grpc import PineconeGRPC
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.core.retrievers import VectorIndexRetriever
import openai


def initialize_pinecone(api_key, index_name, dimension=1536):
    """
    Initialize Pinecone Vector DB and connect to the index or create new index.
    """
    pc = PineconeGRPC(api_key=api_key)

    # Check if the index exists. If not, create it
    if index_name not in pc.list_indexes():
        pc.create_index(
            index_name,
            dimension=dimension,
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )

    pinecone_index = pc.Index(index_name)
    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    return storage_context, pinecone_index

def build_index(storage_context, documents=None):
    """
    Build a new VectorStoreIndex or load an existing one.
    """
    if documents:
        index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)
    else:
        index = VectorStoreIndex(storage_context=storage_context)
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

  openai.api_key = api_key
  prompt = (
        f"Based on the following reviews, write a 2-3 sentence summary of the restaurant, "
        f"focusing on its most notable features relevant to the user query.\n\n"
        f"User query: {user_query}\n\n"
        f"Reviews:\n{numbered_reviews}\n\n"
        f"Provide a clear and concise summary."
    )  
  response = openai.Completion.create(
    engine="text-davinci-003",
    prompt=prompt,
    max_tokens=150
  )
  return response.choices[0].text.strip()