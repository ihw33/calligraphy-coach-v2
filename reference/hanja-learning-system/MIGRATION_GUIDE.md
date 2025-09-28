# Migration Guide - File Organization Plan

## 📋 Files to Copy

This document outlines the files that need to be copied to organize the Hanja learning system.

### 1. 황자원 92서법 Files → hwang92-sebeop/

**Source Location:** `/Users/m4_macbook/a2a-cli-agent/`
**Destination:** `/Users/m4_macbook/hanja-learning-system/hwang92-sebeop/`

Files to copy:
```bash
# Main documents
cp /Users/m4_macbook/a2a-cli-agent/황자원_서법_92법_완전판.md ./hwang92-sebeop/
cp /Users/m4_macbook/a2a-cli-agent/generated/황자원_92_서법_완전판.md ./hwang92-sebeop/
cp /Users/m4_macbook/a2a-cli-agent/complete_92_sebeop_table.md ./hwang92-sebeop/

# Images
cp -r /Users/m4_macbook/a2a-cli-agent/images/hwang_92/* ./images/hwang92/
```

### 2. 한자능력시험 Files → hanja-test-levels/

**Source Location:** `/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/`
**Destination:** `/Users/m4_macbook/hanja-learning-system/hanja-test-levels/`

Files to copy:
```bash
# Level files
cp -r /Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/levels/* ./hanja-test-levels/levels/

# Guides
cp -r /Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/guides/* ./hanja-test-levels/guides/
```

### 3. 서법 매칭 Files → sebeop-matching/

**Source Location:** `/Users/m4_macbook/a2a-cli-agent/`
**Destination:** `/Users/m4_macbook/hanja-learning-system/sebeop-matching/`

Files to copy:
```bash
# JSON data
cp /Users/m4_macbook/a2a-cli-agent/agent3_matching_results.json ./sebeop-matching/

# Python scripts (also copy to scripts/)
cp /Users/m4_macbook/a2a-cli-agent/hanzi_sebeop_matching_a2a.py ./sebeop-matching/
cp /Users/m4_macbook/a2a-cli-agent/agent2_sebeop_analysis.py ./sebeop-matching/
cp /Users/m4_macbook/a2a-cli-agent/agent3_matching_algorithm.py ./sebeop-matching/
```

### 4. Python Scripts → scripts/

**Source Locations:** Various
**Destination:** `/Users/m4_macbook/hanja-learning-system/scripts/`

Files to copy:
```bash
# Main system script
cp /Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/a2a_hanja_system.py ./scripts/

# Analysis scripts
cp /Users/m4_macbook/a2a-cli-agent/hanzi_sebeop_matching_a2a.py ./scripts/
cp /Users/m4_macbook/a2a-cli-agent/agent2_sebeop_analysis.py ./scripts/
cp /Users/m4_macbook/a2a-cli-agent/agent3_matching_algorithm.py ./scripts/
```

---

## 🔧 Copy Commands Summary

Run these commands from `/Users/m4_macbook/hanja-learning-system/` directory:

```bash
# Create subdirectories if not exists
mkdir -p hwang92-sebeop hanja-test-levels/{levels,guides} sebeop-matching images/hwang92 scripts

# Copy 황자원 92서법 files
cp /Users/m4_macbook/a2a-cli-agent/황자원_서법_92법_완전판.md ./hwang92-sebeop/
cp /Users/m4_macbook/a2a-cli-agent/generated/황자원_92_서법_완전판.md ./hwang92-sebeop/
cp /Users/m4_macbook/a2a-cli-agent/complete_92_sebeop_table.md ./hwang92-sebeop/

# Copy images
cp -r /Users/m4_macbook/a2a-cli-agent/images/hwang_92/* ./images/hwang92/

# Copy 한자능력시험 files
cp -r /Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/levels/* ./hanja-test-levels/levels/
cp -r /Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/guides/* ./hanja-test-levels/guides/

# Copy matching data
cp /Users/m4_macbook/a2a-cli-agent/agent3_matching_results.json ./sebeop-matching/

# Copy Python scripts to both locations
cp /Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/a2a_hanja_system.py ./scripts/
cp /Users/m4_macbook/a2a-cli-agent/hanzi_sebeop_matching_a2a.py ./scripts/
cp /Users/m4_macbook/a2a-cli-agent/agent2_sebeop_analysis.py ./scripts/
cp /Users/m4_macbook/a2a-cli-agent/agent3_matching_algorithm.py ./scripts/

# Also keep matching scripts in sebeop-matching for reference
cp /Users/m4_macbook/a2a-cli-agent/hanzi_sebeop_matching_a2a.py ./sebeop-matching/
cp /Users/m4_macbook/a2a-cli-agent/agent2_sebeop_analysis.py ./sebeop-matching/
cp /Users/m4_macbook/a2a-cli-agent/agent3_matching_algorithm.py ./sebeop-matching/
```

---

## ✅ Verification Checklist

After copying, verify that these files exist:

### hwang92-sebeop/
- [ ] 황자원_서법_92법_완전판.md
- [ ] 황자원_92_서법_완전판.md (from generated/)
- [ ] complete_92_sebeop_table.md

### hanja-test-levels/
- [ ] levels/level_08급.md through level_특급.md
- [ ] guides/ (learning guide files)

### sebeop-matching/
- [ ] agent3_matching_results.json
- [ ] hanzi_sebeop_matching_a2a.py
- [ ] agent2_sebeop_analysis.py
- [ ] agent3_matching_algorithm.py

### images/
- [ ] hwang92/ (황자원 92서법 images)

### scripts/
- [ ] a2a_hanja_system.py
- [ ] hanzi_sebeop_matching_a2a.py
- [ ] agent2_sebeop_analysis.py
- [ ] agent3_matching_algorithm.py

---

## 📝 Notes

- Original files remain in their source locations (copy, not move)
- This structure allows for better organization and easier navigation
- Each subdirectory can have its own README for specific documentation
- Python scripts are duplicated in scripts/ folder for centralized access

---

Last Updated: 2025-01-23