#!/usr/bin/env python3
import json
import os
from datetime import datetime

def generate_metadata():
    # Load character data
    with open("/Users/m4_macbook/Projects/calligraphy-coach-v2/wangxizhi-images/images/hanja_1grade_page39.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    base_path = "/Users/m4_macbook/Projects/calligraphy-coach-v2/wangxizhi-images/images"
    
    for char_data in data["characters"]:
        filename = char_data["filename"]
        char = char_data["character"]
        reading = char_data["reading"]
        
        # Create metadata for each image
        metadata = {
            "filename": filename,
            "character": char,
            "reading": reading,
            "meaning": char_data["meaning"],
            "radical": char_data["radical"],
            "strokes": char_data["strokes"],
            "explanation": char_data["explanation"],
            "examples": char_data["examples"],
            "source": {
                "book": "한자능력검정시험 1급",
                "page": 39,
                "extraction_date": datetime.now().isoformat()
            },
            "image_info": {
                "format": "PNG",
                "dimensions": "400x200",
                "dpi": 300
            },
            "tags": ["hanja", "chinese-character", "grade-1", "calligraphy", f"reading-{reading}"]
        }
        
        # Add synonyms if they exist
        if "synonyms" in char_data:
            metadata["synonyms"] = char_data["synonyms"]
        
        # Save metadata as JSON
        meta_filename = filename.replace(".png", "_meta.json")
        meta_path = os.path.join(base_path, meta_filename)
        
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)
        
        print(f"Generated metadata: {meta_filename}")

if __name__ == "__main__":
    generate_metadata()