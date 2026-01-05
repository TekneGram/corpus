const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/corpus.sqlite', (err) => {
    if (err) {
        console.error('SQLITE: Error opening database', err.message);
    } else {
        console.log('SQLITE: Connected to the SQLite database');

        db.run("PRAGMA foreign_keys = ON;", (error) => {
            if (error) {
                console.error("Error enabling foreign keys", error.message);
            } else {
                console.log("Foreign keys are enabled");
            }
        })
    }
});

module.exports = db;