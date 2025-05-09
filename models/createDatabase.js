const db = require('../database/index');

class CreateDatabase {

    constructor () {

    }

    static createProjectTable() {
        const dbQuery = db.prepare(`CREATE TABLE IF NOT EXISTS project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating project table', error.message);
            } else {
                console.log("Project table created or already exists.")
            }
        });

        dbQuery.finalize();
    }

    static createCorpusTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS corpus (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                corpus_name TEXT NOT NULL,
                project_id INTEGER UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
            )
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating corpus table', error.message);
            } else {
                console.log("Corpus table created or already exists.")
            }
        });

        dbQuery.finalize();
    }

    static createGroupTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS corpus_group (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_name TEXT NOT NULL,
                corpus_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE
            )    
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating group table', error.message);
            } else {
                console.log("Group table created or already exists.")
            }
        });

        dbQuery.finalize();
    }

    static createFilesTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name TEXT NOT NULL,
                group_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE
            )    
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating files table', error.message);
            } else {
                console.log("Files table created or already exists.")
            }
        });

        dbQuery.finalize();
    }

    static createWordsTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS words (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word TEXT NOT NULL,
                group_id INTEGER,
                file_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating words table', error.message);
            } else {
                console.log("Words table created or already exists.")
            }
        });

        dbQuery.finalize();
    }

    static createCollsTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS colls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                coll TEXT NOT NULL,
                group_id INTEGER,
                file_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating collocations table', error.message);
            } else {
                console.log("Collocations table created or already exists.")
            }
        });

        dbQuery.finalize();
    }

    static createThreeBunsTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS threeBuns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                threeBun TEXT NOT NULL,
                group_id INTEGER,
                file_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating threeBuns table', error.message);
            } else {
                console.log("threeBuns table created or already exists.")
            }
        });

        dbQuery.finalize();
    }

    static createFourBunsTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS fourBuns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fourBun TEXT NOT NULL,
                group_id INTEGER,
                file_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating fourBuns table', error.message);
            } else {
                console.log("fourBuns table created or already exists.")
            }
        });

        dbQuery.finalize();
    }

    static createCorpusFileTextTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS corpus_file_text (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                group_id INTEGER,
                file_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating corpus_file_text table', error.message);
            } else {
                console.log("corpus_file_text table created or already exists.");
            }
        });

        dbQuery.finalize();
    }

    static createWordCountsPerFileTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS word_counts_per_file (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER,
                file_id INTEGER,
                word_count INTEGER,
                token_count INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating the word_counts_per_file table', error.message);
            } else {
                console.log('word_counts_per_file table created or already exists.');
            }
        });
        dbQuery.finalize();
    }

    static createWordListPerFileTable() {
        const dbQuery = db.prepare(`
            CREATE TABLE IF NOT EXISTS word_list_per_file (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER,
                file_id INTEGER,
                word TEXT NOT NULL,
                count INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `);

        dbQuery.run((error) => {
            if (error) {
                console.error('Error creating the word_list_per_file table', error.message);
            } else {
                console.log('word_list_per_file table created or already exists.');
            }
        });
        dbQuery.finalize();
    }



}

module.exports = CreateDatabase;