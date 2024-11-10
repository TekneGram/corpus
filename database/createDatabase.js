const db = require('./index');
console.log(db);
class CreateDatabase {

    constructor () {

    }

    static createProjectTable() {
        db.prepare(`CREATE TABLE IF NOT EXISTS project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();
    }

    static createCorpusTable() {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS corpus (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                corpus_name TEXT NOT NULL,
                project_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
            )
        `).run();
    }

    static createGroupTable() {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS group (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_name TEXT NOT NULL,
                corpus_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE
            )    
        `).run();
    }

    static createFilesTable() {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name TEXT NOT NULL,
                corpus_id INTEGER,
                group_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE,
                FOREIGN KEY (group_id) REFERENCES group(id) ON DELETE CASCADE
            )    
        `).run();
    }

    static createWordsTable() {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS words (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word TEXT NOT NULL,
                corpus_id INTEGER,
                group_id INTEGER,
                file_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE,
                FOREIGN KEY (group_id) REFERENCES group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `).run();
    }

    static createCollsTable() {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS colls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                coll TEXT NOT NULL,
                corpus_id INTEGER,
                group_id INTEGER,
                file_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE,
                FOREIGN KEY (group_id) REFERENCES group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `).run();
    }

    static createThreeBunsTable() {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS threeBuns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                threeBun TEXT NOT NULL,
                corpus_id INTEGER,
                group_id INTEGER,
                file_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE,
                FOREIGN KEY (group_id) REFERENCES group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `).run();
    }

    static createFourBunsTable() {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS fourBuns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fourBun TEXT NOT NULL,
                corpus_id INTEGER,
                group_id INTEGER,
                file_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE,
                FOREIGN KEY (group_id) REFERENCES group(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
            )
        `).run();
    }

}

module.exports = CreateDatabase;