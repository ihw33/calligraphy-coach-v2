# Python Scripts for Hanja Learning System

## 📚 Overview

This directory contains Python scripts that power the Hanja Learning System, providing analysis, matching, and learning tools.

## 📁 Script Descriptions

### 1. a2a_hanja_system.py
**Main System Controller**
- Central script for the entire Hanja learning system
- Manages database of characters across all levels
- Provides unified interface for all functionalities

**Key Features:**
- Character lookup and information retrieval
- Level-based study management
- Progress tracking and statistics
- Integration with other modules

**Usage:**
```python
python a2a_hanja_system.py --lookup 學
python a2a_hanja_system.py --level 3급 --practice
python a2a_hanja_system.py --stats
```

### 2. hanzi_sebeop_matching_a2a.py
**Character-Method Matching Engine**
- Analyzes character structure
- Matches characters to appropriate 92 methods
- Provides writing recommendations

**Key Functions:**
- `match_character(char)` - Get methods for a single character
- `batch_match(char_list)` - Process multiple characters
- `get_method_details(method_id)` - Detailed method information

**Usage:**
```python
python hanzi_sebeop_matching_a2a.py --char 學
python hanzi_sebeop_matching_a2a.py --file characters.txt
```

### 3. agent2_sebeop_analysis.py
**Deep Structure Analysis Tool**
- Performs detailed structural analysis of characters
- Identifies patterns and components
- Generates analytical reports

**Key Features:**
- Component breakdown
- Stroke pattern analysis
- Statistical analysis of character sets
- Complexity scoring

**Usage:**
```python
python agent2_sebeop_analysis.py --analyze 學
python agent2_sebeop_analysis.py --report level_3급.txt
```

### 4. agent3_matching_algorithm.py
**Advanced Matching Algorithm**
- Enhanced matching with ML components
- Context-aware recommendations
- Optimization for different writing styles

**Key Features:**
- Machine learning-based matching
- Style-specific adjustments
- Confidence scoring
- Continuous learning from feedback

**Usage:**
```python
python agent3_matching_algorithm.py --advanced 學
python agent3_matching_algorithm.py --optimize dataset.json
```

## 🔧 Installation & Setup

### Requirements
```bash
pip install -r requirements.txt
```

### Dependencies
- Python 3.8+
- pandas
- numpy
- json
- Optional: tensorflow/pytorch for ML components

## 💻 Common Operations

### 1. Character Information Lookup
```python
from a2a_hanja_system import HanjaSystem

system = HanjaSystem()
info = system.lookup("學")
print(f"Character: {info['character']}")
print(f"Meaning: {info['meaning']}")
print(f"Level: {info['level']}")
```

### 2. Method Matching
```python
from hanzi_sebeop_matching_a2a import MethodMatcher

matcher = MethodMatcher()
methods = matcher.match("學")
for method in methods:
    print(f"Method: {method['name']} (Confidence: {method['confidence']})")
```

### 3. Structural Analysis
```python
from agent2_sebeop_analysis import StructureAnalyzer

analyzer = StructureAnalyzer()
structure = analyzer.analyze("學")
print(f"Type: {structure['type']}")
print(f"Components: {structure['components']}")
print(f"Complexity: {structure['complexity']}")
```

### 4. Batch Processing
```python
# Process all characters in a level
from a2a_hanja_system import process_level

results = process_level("3급")
print(f"Processed {len(results)} characters")
```

## 📊 Data Formats

### Input Formats
- **Single character**: String or Unicode
- **Character list**: Text file (one per line)
- **JSON**: Structured data with metadata
- **CSV**: Tabular data with additional fields

### Output Formats
- **JSON**: Detailed results with all metadata
- **CSV**: Tabular format for analysis
- **HTML**: Visual reports with styling
- **Markdown**: Documentation-ready format

## 🎯 Script Parameters

### Common Parameters
- `--char, -c`: Single character input
- `--file, -f`: Input file path
- `--output, -o`: Output file path
- `--format`: Output format (json/csv/html/md)
- `--verbose, -v`: Detailed output
- `--level, -l`: Hanja test level

### Advanced Parameters
- `--confidence-threshold`: Minimum confidence for matches
- `--max-methods`: Maximum methods per character
- `--style`: Calligraphy style preference
- `--ml-model`: Specific ML model to use

## 🔍 Debugging

### Enable Debug Mode
```bash
export HANJA_DEBUG=1
python script.py --verbose
```

### Log Files
- Location: `./logs/`
- Format: `YYYY-MM-DD_scriptname.log`
- Levels: DEBUG, INFO, WARNING, ERROR

## 📈 Performance Tips

1. **Batch Processing**: Process multiple characters together
2. **Caching**: Enable result caching for repeated queries
3. **Parallel Processing**: Use `--parallel` flag for large datasets
4. **Database Mode**: Use SQLite for large-scale operations

## 🔗 Integration Examples

### Web API
```python
from flask import Flask, jsonify
from a2a_hanja_system import HanjaSystem

app = Flask(__name__)
system = HanjaSystem()

@app.route('/lookup/<char>')
def lookup(char):
    return jsonify(system.lookup(char))
```

### Command Line Tool
```bash
# Add to ~/.bashrc or ~/.zshrc
alias hanja-lookup='python /path/to/a2a_hanja_system.py --lookup'
alias hanja-match='python /path/to/hanzi_sebeop_matching_a2a.py --char'
```

---

Last Updated: 2025-01-23