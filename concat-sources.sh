#!/bin/bash

# Configurable variables
output_file="sources-all.txt"
dir_structure_file="sources-tree.txt"
file_masks=(".ts") # File extensions to include (".ts" ".json" ".js" ".html" ".css")
ignore_dirs=("node_modules" "dist" "coverage") # Directories to ignore

# Clear the output file if it already exists
> "$output_file"

# Function to check if a directory should be ignored
should_ignore_dir() {
    for ignore_dir in "${ignore_dirs[@]}"; do
        if [[ $(basename "$1") == "$ignore_dir" ]]; then
            return 0 # 0 means true in shell script context
        fi
    done
    return 1 # 1 means false
}

# Function to concatenate files
concat_files() {
    for file in "$1"/*; do
        if [ -d "$file" ]; then
            # Check if directory should be ignored
            if should_ignore_dir "$file"; then
                echo "Skipping directory $file"
                continue
            fi
            # Recurse into directory if not ignored
            concat_files "$file"
        else
            # Check if file matches any of the file masks
            for ext in "${file_masks[@]}"; do
                if [[ $file == *$ext ]]; then
                    echo "Processing $file..."
                    echo "// File: $file" >> "$output_file"
                    cat "$file" >> "$output_file"
                    echo -e "\n" >> "$output_file"
                    break # No need to check other extensions
                fi
            done
        fi
    done
}

# Start concatenation from the current directory
concat_files "."

echo "Concatenation complete. Output in $output_file"
echo "Directory structure generated in $dir_structure_file"

tree -I "node_modules|dist|coverage" > "$dir_structure_file"
