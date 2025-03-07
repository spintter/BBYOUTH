#!/bin/bash

# Extract the JSON specification from Round 4
cat deepseek-3d-round4.json | jq -r '.choices[0].message.content' | grep -A 1000 '```json' | grep -B 1000 '```' | grep -v '```' > 3d-implementation-spec.json

echo "JSON specification extracted to 3d-implementation-spec.json" 