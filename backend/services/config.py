import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

def get_openai_api_key():
    """
    Retrieve OpenAI API key from environment variables.
    """
    return os.getenv("OPENAI_API_KEY")

def get_pinecone_api_key():
    """
    Retrieve Pinecone API key from environment variables.
    """
    return os.getenv("PINECONE_API_KEY")
