import requests
import json
import time

# TMDb API key
api_key = 'api_key_here'
# Base URL for TMDb popular movies endpoint
base_url = 'https://api.themoviedb.org/3/movie/popular'
# Base URL for movie poster images
image_base_url = 'https://image.tmdb.org/t/p/w500'

# List to store movie data
movie_data = []

# Number of pages to fetch 
total_pages = 100  

# Loop through each page of results
for page in range(1, total_pages + 1):
    print(f"Fetching page {page}...")
    params = {
        'api_key': api_key,
        'language': 'en-US',
        'page': page
    }
    # Send GET request to TMDb API
    response = requests.get(base_url, params=params)
    # Parse JSON response
    data = response.json()
    
    # Loop through each movie in the results
    for movie in data.get('results', []):
        poster_path = movie.get('poster_path')
        # Only add movies with a poster image
        if poster_path:
            movie_data.append({
                'title': movie['title'],
                'poster_url': f'{image_base_url}{poster_path}'
            })
    time.sleep(0.2)

# Save the collected movie data to a JSON file
with open('popular_movie_posters.json', 'w', encoding='utf-8') as file:
    json.dump(movie_data, file, indent=2, ensure_ascii=False)
