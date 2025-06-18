#!/bin/bash

filename="default-issues.txt" 

# Read the file line by line
while IFS= read -r line; do
  # Process each line here
  sub="$(echo $line | sed 's/.* //g')"
  tech="$(echo $line | sed 's/.*-//g')"
  gh issue create \
    --title "$line" \
    --body "Initial/set-up work. Not functionally correct, just some boiler plate to get some foundation." \
    --label "enhancement" \
    --milestone "v0.0.0" \
    --repo "thephen/trivia-together" \
    --project "trivia-together" \
    --assignee "thephen"
done < "$filename"
