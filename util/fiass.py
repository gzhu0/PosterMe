import json
import numpy as np
import faiss

with open("popular_movie_poster.json", "r") as file:
    data = json.load(file)

titles = [item['title'] for item in data]
urls = [item['poster_url'] for item in data]
embeddings = np.array([item['embedding'] for item in data], dtype='float32')

# Create a FAISS index (L2 distance)
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)

# Example: search for the most similar image to the first embedding
query_embedding = embeddings[0].reshape(1, -1)  # shape (1, embedding_dim)
Distances, Indicies = index.search(query_embedding, k=5)  # k=5 nearest neighbors

# Print the top 5 matching titles and URLs
for index in Indicies[0]:
    print(f"Title: {titles[index]}, URL: {urls[index]}")