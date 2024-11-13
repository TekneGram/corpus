#include "DatabaseHandler.h"
#include <sqlite3.h>
#include <iostream>

DatabaseHandler::DatabaseHandler(sqlite3* db)
{
    dbConn = db;
}

void DatabaseHandler::createCorpusName(const int& project_id, const std::string& corpus_name)
{
    sqlite3_stmt* statement; // Pointer to a prepared statement

    const char* sql = "INSERT INTO corpus (corpus_name, project_id) VALUES (?, ?);";
    int exit_code = sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr);
    if (exit_code != SQLITE_OK) {
        std::cerr << "Error preparing statement: " << sqlite3_errmsg(dbConn) << std::endl;
    }
    sqlite3_bind_text(statement, 1, corpus_name.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(statement, 2, project_id);

    exit_code = sqlite3_step(statement);
    if (exit_code != SQLITE_DONE) {
        std::cerr << "Error inserting data: " <<sqlite3_errmsg(dbConn);
        sqlite3_finalize(statement);
    }
    std::cout << "Data inserted successfully!\n";
    sqlite3_finalize(statement);
}

// void DatabaseHandler::createGroup()
// {

// }

// void DatabaseHandler::insertFile()
// {

// }

// void DatabaseHandler::insertWords()
// {

// }

// void DatabaseHandler::insertColls()
// {

// }

// void DatabaseHandler::insertThreeBuns()
// {

// }

// void DatabaseHandler::insertFourBuns()
// {

// }