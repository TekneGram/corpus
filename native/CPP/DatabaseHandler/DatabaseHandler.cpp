#include "DatabaseHandler.h"
#include <stdexcept>
#include <iostream>

// --------------
// Construction
// --------------

DatabaseHandler::DatabaseHandler(const std::string& dbPath) 
    : dbConn(nullptr)
{
    if (sqlite3_open_v2(
        dbPath.c_str(),
        &dbConn,
        SQLITE_OPEN_READWRITE,
        nullptr
    ) != SQLITE_OK) {
        throw std::runtime_error("Failed to open database: " + std::string(sqlite3_errmsg(dbConn)));
    }

    exec("PRAGMA foreign_keys = ON;");
}

DatabaseHandler::~DatabaseHandler()
{
    if (dbConn) {
        sqlite3_close(dbConn);
        dbConn = nullptr;
    }
}

// ----------------
// Low level helper
// ----------------
void DatabaseHandler::exec(const std::string& sql)
{
    char* errMsg = nullptr;
    if (sqlite3_exec(dbConn, sql.c_str(), nullptr, nullptr, &errMsg) != SQLITE_OK) {
        std::string msg = errMsg ? errMsg : "Unknown SQLite error";
        sqlite3_free(errMsg);
        throw std::runtime_error(msg);
    }
}

void DatabaseHandler::ensureSchema()
{
    exec(R"sql(

        CREATE TABLE IF NOT EXISTS project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS corpus (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            corpus_name TEXT NOT NULL,
            project_id INTEGER UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS corpus_group (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_name TEXT NOT NULL,
            corpus_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT NOT NULL,
            group_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL,
            group_id INTEGER,
            file_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
            FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS colls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coll TEXT NOT NULL,
            group_id INTEGER,
            file_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
            FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS threeBuns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            threeBun TEXT NOT NULL,
            group_id INTEGER,
            file_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
            FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS fourBuns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fourBun TEXT NOT NULL,
            group_id INTEGER,
            file_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
            FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS corpus_file_text (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            group_id INTEGER,
            file_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
            FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS word_counts_per_file (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER,
            file_id INTEGER,
            type_count INTEGER,
            token_count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
            FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS word_list_per_file (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER,
            file_id INTEGER,
            word TEXT NOT NULL,
            count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE,
            FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS word_counts_per_group (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER,
            type_count INTEGER,
            token_count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS word_list_per_group (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER,
            word TEXT NOT NULL,
            count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES corpus_group(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS word_counts_per_corpus (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            corpus_id INTEGER,
            type_count INTEGER,
            token_count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS word_list_per_corpus (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            corpus_id INTEGER,
            word TEXT NOT NULL,
            count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS corpus_prepped_status (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            corpus_id INTEGER,
            analysis_type TEXT NOT NULL,
            up_to_date BOOLEAN NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (corpus_id) REFERENCES corpus(id) ON DELETE CASCADE
        );

    )sql");
}