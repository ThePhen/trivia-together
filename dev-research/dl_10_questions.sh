#! /usr/bin/env bash

# This script fetches trivia questions from the Open Trivia Database every 10 seconds
# and saves them to a file named with the current timestamp.

# while true; do
#     sleep 10
#     file="$(date +%Y-%m-%d_%H-%M-%S).json"
#     curl 'https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple'>> $file
# done


while true; do
    sleep 5
    node server.js | column
    sleep 1
    clear
    sqlite3 ./questions.db "select count(*) as count, json_extract(question, '$.category'), json_extract(question, '$.difficulty') from questions group by 2, 3 order by 1 desc" | column
    sqlite3 ./questions.db "select count(*) as count from questions" | column
    echo
done
