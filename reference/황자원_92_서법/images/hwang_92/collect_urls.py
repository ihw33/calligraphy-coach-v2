#!/usr/bin/env python3
import requests
import re
import json
from urllib.parse import urljoin
import time

# Base URL and pages to crawl
base_url = "https://www.70thvictory.com.tw/shufazuopin/qingchao/"
start_page = 267853
end_page = 267864

# Storage for all image URLs
all_images = {}

def get_images_from_page(page_num):
    """Extract image URLs from a single page"""
    url = f"{base_url}{page_num}.htm"
    print(f"Fetching: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Find all image URLs ending with .jpg
        img_pattern = r'src="([^"]*\.jpg)"'
        matches = re.findall(img_pattern, response.text)
        
        # Convert relative URLs to absolute URLs
        image_urls = []
        for match in matches:
            if match.startswith('/'):
                full_url = f"https://www.70thvictory.com.tw{match}"
            else:
                full_url = urljoin(url, match)
            image_urls.append(full_url)
        
        print(f"Found {len(image_urls)} images on page {page_num}")
        return image_urls
        
    except requests.RequestException as e:
        print(f"Error fetching page {page_num}: {e}")
        return []

def main():
    print("Starting to collect image URLs from all pages...")
    
    for page_num in range(start_page, end_page + 1):
        image_urls = get_images_from_page(page_num)
        if image_urls:
            all_images[page_num] = image_urls
        
        # Be respectful to the server
        time.sleep(1)
    
    # Save results to JSON file
    with open('/Users/m4_macbook/a2a-cli-agent/images/hwang_92/image_urls.json', 'w', encoding='utf-8') as f:
        json.dump(all_images, f, indent=2, ensure_ascii=False)
    
    # Print summary
    total_images = sum(len(urls) for urls in all_images.values())
    print(f"\nCollection complete!")
    print(f"Total pages processed: {len(all_images)}")
    print(f"Total images found: {total_images}")
    
    # Print breakdown by page
    for page_num, urls in all_images.items():
        print(f"Page {page_num}: {len(urls)} images")

if __name__ == "__main__":
    main()