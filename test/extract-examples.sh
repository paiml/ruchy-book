#!/bin/bash
# Extract and count Ruchy examples from the book

echo "📚 Extracting Ruchy examples from book..."
echo "========================================="

TOTAL=0
BY_CHAPTER=""

for file in ../src/*.md; do
    if [ -f "$file" ]; then
        COUNT=$(grep -c '```ruchy\|```ruc' "$file" 2>/dev/null || echo 0)
        if [ $COUNT -gt 0 ]; then
            BASENAME=$(basename "$file")
            echo "$BASENAME: $COUNT examples"
            BY_CHAPTER="$BY_CHAPTER\n  - $BASENAME: $COUNT"
            TOTAL=$((TOTAL + COUNT))
        fi
    fi
done

echo "========================================="
echo "📊 Summary:"
echo "  Total Ruchy examples: $TOTAL"
echo ""
echo "By Chapter:$BY_CHAPTER"

# Create examples directory structure
mkdir -p examples/extracted

# Extract first few examples for testing
echo ""
echo "📝 Extracting examples for testing..."

EXTRACTED=0
for file in ../src/ch*.md; do
    if [ -f "$file" ]; then
        CHAPTER=$(basename "$file" .md)
        
        # Extract code blocks
        awk '/```ruchy|```ruc/{flag=1; next} /```/{flag=0} flag' "$file" | \
        while IFS= read -r line || [ -n "$line" ]; do
            if [ ! -z "$line" ]; then
                EXTRACTED=$((EXTRACTED + 1))
                echo "$line" >> "examples/extracted/${CHAPTER}_example_${EXTRACTED}.ruchy"
                
                # Stop after 10 examples for quick testing
                if [ $EXTRACTED -ge 10 ]; then
                    break 2
                fi
            fi
        done
    fi
done

echo "✅ Extracted sample examples to examples/extracted/"
ls -la examples/extracted/*.ruchy 2>/dev/null | head -5