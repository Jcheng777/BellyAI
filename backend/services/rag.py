import pinecone
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.core.retrievers import VectorIndexRetriever
import openai


def initialize_pinecone(api_key, environment, index_name, dimension=1536, region="us-east-1"):
    """
    Initialize Pinecone Vector DB and connect to the index or create new index.
    """
    pinecone.init(api_key=api_key, environment=environment)

    if index_name not in pinecone.list_indexes():
        pinecone.create_index(index_name, dimension=dimension)

    pinecone_index = pinecone.Index(index_name)
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
