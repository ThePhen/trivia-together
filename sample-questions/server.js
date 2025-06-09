// read every json input file
// for each question in the file
// create a MD5 has for the question to serve as the key
// store the key, and the question in SQLite

import * as tar from "tar";
import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const dbPath = path.join(__dirname, "questions.db");
const db = new sqlite3.Database(dbPath);

// Create the questions table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    question JSONB NOT NULL
  )`);
});

// Function to insert a question into the database
function insertQuestion(id, category, difficulty, question) {
  db.run(
    `INSERT OR IGNORE 
      INTO questions (id, category, difficulty, question) 
      VALUES (?1, ?2, ?3, ?4)`,
    [id, category, difficulty, question],
    (err) => {
      if (err) {
        console.log(`Error inserting question: ${err.message}`);
      } else {
        console.log(`Inserted question with ID: ${id}`);
      }
    }
  );
}

// start processing a tar file holding all the json files
async function processTarFile(tarFilePath) {
  const dirPath = path.dirname(tarFilePath);
  await tar.x({ file: tarFilePath, C: dirPath });
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.log(`Error reading directory ${dirPath}:`, err.message);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (path.extname(file) === ".json") {
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.log(`Error reading file ${filePath}:`, err.message);
            return;
          }
          const questions = JSON.parse(data);
          handlePayload(questions);
        });
        fs.unlinkSync(filePath); // remove the file after processing
      }
    });
  });
}

// function to GET json from https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple then call handlePayload
async function fetchQuestions() {
  // const url = 'https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple'
  // const url = 'https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple'
  const token =
    "99f4ca9b68bcde6754f7254c78db79ab97b5fb76423865a5c1f243469e9aa5aa";
  const url = `https://opentdb.com/api.php?amount=50&token=${token}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `HTTP error!\nstatus: ${
        response.status
      }.\nresponse: ${await response.text()}`
    );
  }
  const data = await response.json();
  console.dir(data, { depth: null }); // log the entire data structure
  handlePayload(data);
}

function handlePayload(questions) {
  questions.results.forEach((question) => {
    const clue = question.question;
    const category = question.category;
    const difficulty = question.difficulty;
    const id = createHash("md5").update(clue).digest("hex");
    insertQuestion(id, category, difficulty, JSON.stringify(question));
  });
}

// // Start processing the tar file
const tarFilePath = path.join(__dirname, "sample_questions_raw.tgz");
if (fs.existsSync(tarFilePath)) {
  await processTarFile(tarFilePath);
} else {
  console.error(`Tar file ${tarFilePath} does not exist.`);
}

// await fetchQuestions()
