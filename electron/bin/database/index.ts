const path = require("path")
const sqlite3 = require("sqlite3").verbose()

const dbPath = 
  process.env.CORPUS_DB_PATH && process.env.CORPUS_DB_PATH.trim().length > 0
    ? process.env.CORPUS_DB_PATH
    : path.join(__dirname, "corpus.sqlite")

const db = new sqlite3.Database(dbPath, (err:any) => {
  if (err) {
    console.error("SQLITE: Error opening database", err.message)
    console.error("SQLITE: Attempted path: ", dbPath);
  } else {
    console.log("SQLITE: Connected to SQLite database")
    console.log("SQLITE: DB PATH: ", dbPath);

    db.run("PRAGMA foreign_keys = ON;", (error:any) => {
      if (error) {
        console.error("Error enabling foreign keys", error.message)
      }
    })
  }
})

module.exports = db
