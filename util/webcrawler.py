'Web crawlign util to get movie poster image urls'

import os
from icrawler.builtin import GoogleImageCrawler
from icrawler.downloader import ImageDownloader

output_file = 'movie_poster_urls.txt'
max_num = 200

keywords = [
    "movie poster", "film poster", "cinema poster", "classic movie poster",
    "hollywood movie poster", "blockbuster movie poster", "oscar winning movie poster",
    "drama movie poster", "action movie poster", "romance movie poster",
    "thriller movie poster", "horror movie poster", "comedy movie poster",
    "biography movie poster", "historical movie poster", "crime movie poster",
    "adventure movie poster", "sci-fi movie poster", "foreign movie poster",
    "independent movie poster", "award winning movie poster", "famous movie poster",
    "realistic movie poster", "live action movie poster", "english movie poster",
    "french movie poster", "italian movie poster", "spanish movie poster",
    "german movie poster", "japanese movie poster", "korean movie poster"
]

# Collects URLs instead of downloading images
class URLOnlyDownloader(ImageDownloader):
    def download(self, task, default_ext, timeout=5, **kwargs):
        if task['file_url']:
            with open(output_file, 'a') as f:
                f.write(task['file_url'] + '\n')
        return

# Set up the crawler
google_crawler = GoogleImageCrawler( downloader_cls=URLOnlyDownloader,storage={'root_dir': 'movie_posters'})

# Crawl for each keyword
for keyword in keywords:
    google_crawler.crawl(keyword=keyword, max_num=max_num)
