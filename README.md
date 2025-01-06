# BellyAI 🍽️

Do you struggle to find great restaurants that match all your preferences? BellyAI is here to help! Just send a prompt describing the kind of restaurant you're looking for, and BellyAI will provide tailored recommendations along with detailed business information.

## Tech Stack ##
Frontend:
  - Frameworks/Libraries: React, Next.js, Tailwind CSS, Typescript
  - Hosting: Vercel

Backend:
  - Languages/Frameworks: Python, Flask
  - Hosting: Heroku
  - RAG: LlamaIndex, Pinecone
  - Data sources: Yelp API, Serp API

## How It Works ##
![resturant_review](https://github.com/user-attachments/assets/a7e9db0d-ab02-4b0a-a9fe-85fc8c51064a)

1. Data Collection
- Using the Yelp Business Search API, I gathered restaurant data around the NYC area.
- Since Yelp only provides three reviews per business, I leveraged the Serp API to retrieve up to 50 reviews per business.

2. Vector DB Creation
- I used Pinecone as the vector database for storing vector embeddings and associated metadata (such as business information tied to each review).
- I then created an index that consolidated all reviews for seamless retrieval during user queries.

3. Backend API
- Built a Flask server to handle the recommendation process.
- It retrieves reviews based on user input as it queries the vector db, then sends retrieved reviews to a LLM to summarize restaurant details, and then sends both the business metadata and summarized reviews.

4. Frontend
- Created with Next.js, React, and Tailwind CSS for a modern and responsive user interface.
- The restaurant data is displayed as interactive card components showcasing key details such as name, address, phone number, rating, and website.
