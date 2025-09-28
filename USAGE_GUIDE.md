# Character Extraction Usage Guide

## Overview
Two Python scripts for extracting individual Chinese characters from Wang Xizhi calligraphy:
1. `extract_characters.py` - For PDF files
2. `extract_from_image.py` - For image files (PNG, JPG, etc.)

## Installation

### 1. Install Python dependencies:
```bash
pip install opencv-python pillow numpy
```

### 2. For PDF support (only if using extract_characters.py):
```bash
# On macOS:
brew install poppler

# Then install Python package:
pip install pdf2image
```

## Usage

### For Image Files (Recommended):
```bash
python extract_from_image.py path/to/your/image.png
```

Or specify custom output directory:
```bash
python extract_from_image.py path/to/image.png --output ./my_output_dir
```

### For PDF Files:
```bash
python extract_characters.py path/to/your/pdf.pdf --page 6
```

## Output Files

The script will create a directory with:
- `01_大_대.png` - Individual character images (numbered by reading order)
- `02_唐_당.png`
- `03_藏_장.png`
- ... (etc.)
- `character_sheet.png` - Contact sheet with all characters
- `metadata.json` - Character information and metadata

## Character Information (Page 6)

| # | Character | Korean | Meaning | Position |
|---|-----------|--------|---------|----------|
| 1 | 大 | 대 | 큰 (big) | Right column, row 1 |
| 2 | 唐 | 당 | 당나라 (Tang dynasty) | Right column, row 2 |
| 3 | 藏 | 장 | 감출 (hide) | Right column, row 3 |
| 4 | 聖 | 성 | 성인 (saint) | Right column, row 4 |
| 5 | 敎 | 교 | 가르칠 (teach) | Middle column, row 1 |
| 6 | 序 | 서 | 차례 (order) | Middle column, row 2 |
| 7 | 太 | 태 | 클 (great) | Middle column, row 3 |
| 8 | 宗 | 종 | 마루 (ancestor) | Left column, row 1 |
| 9 | 文 | 문 | 글월 (literature) | Left column, row 2 |
| 10 | 皇 | 황 | 임금 (emperor) | Left column, row 3 |
| 11 | 帝 | 제 | 임금 (emperor) | Left column, row 4 |

## Adjusting Grid Positions

If characters are not extracted correctly, you can modify the grid positions in the script:

1. Open `extract_from_image.py`
2. Find the `extract_characters_grid` method
3. Adjust these parameters:
   - `margin_right` - Space for text info on right
   - `margin_left` - Left margin
   - `col_width` - Width of each column
   - `row_height` - Height of each row

## Troubleshooting

1. **Characters cut off**: Adjust padding in `clean_character_image` method
2. **Wrong positions**: Modify grid parameters in `extract_characters_grid`
3. **Poor quality**: Adjust threshold values in `clean_character_image`

## Example Command
```bash
# If your image is in the current directory:
python extract_from_image.py wangxizhi_page6.png

# Output will be in:
# /Users/m4_macbook/Projects/calligraphy-coach-v2/wangxizhi/page6/
```