#include "DatabaseSummarizer.h"
#include <sqlite3.h>
#include <iostream>
#include "../lib/json.hpp"
#include "../CorpusMetadata.h"

DatabaseSummarizer::DatabaseSummarizer(sqlite3* db)
{
    dbConn = db;
}

void DatabaseSummarizer::countWordsPerFile(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT
            corpus_group.id AS group_id,
            words.file_id,
            COUNT(DISTINCT words.word) AS type_count,
            COUNT(*) AS token_count
        FROM
            corpus_group
        JOIN
            words ON corpus_group.id = words.group_id
        WHERE
            corpus_group.corpus_id = ?
        GROUP BY
            corpus_group.id, words.file_id;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement: " << sqlite3_errmsg(dbConn) << std::endl;
        return;
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus id data to statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    const char* insertSQL = R"(
        INSERT INTO words_counts_per_file (group_id, file_id, type_count, token_count) VALUES (?, ?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing insert statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    // Start a transaction to speed up batch inserts
    int exit_code = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (exit_code != SQLITE_OK) {
        std::cerr << "Error starting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        return;
    }

    // Execute the query and insert the results into the new table
    while (sqlite3_step(statement) == SQLITE_ROW) {
        int group_id = sqlite3_column_int(statement, 0);
        int file_id = sqlite3_column_int(statement, 1);
        int type_count = sqlite3_column_int(statement, 2);
        int token_count = sqlite3_column_int(statement, 3);

        if (sqlite3_bind_int(insertStatement, 1, group_id) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 2, file_id) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 3, type_count) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 4, token_count) != SQLITE_OK
        ) {
            std::cerr << "Error binding values to insert statement: " << sqlite3_errmsg(dbConn) << std::endl;
            continue;
        }

        if (sqlite3_step(insertStatement) != SQLITE_DONE) {
            std::cerr << "Error executing insert statement: " << sqlite3_errmsg(dbConn) << std::endl;
        }

        sqlite3_reset(insertStatement);
    }

    // Commit the transaction
    if (sqlite3_exec(dbConn, "COMMIT;", nullptr, nullptr, nullptr) != SQLITE_OK) {
        std::cerr << "Error committing transaction: " << sqlite3_errmsg(dbConn) << std::endl;
    }

    // Finalize the statements
    sqlite3_finalize(statement);
    sqlite3_finalize(insertStatement);
    return;
}

void DatabaseSummarizer::createWordListPerFile(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT
            corpus_group.id AS group_id,
            words.file_id,
            words.word,
            COUNT(*) AS count
        FROM
            corpus_group
        JOIN
            words ON corpus_group.id = words.group_id
        WHERE
            corpus_group.corpus_id = ?
        GROUP BY corpus_group.id, words.file_id, words.word
        ORDER BY group_id, file_id, words.word;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement: " << sqlite3_errmsg(dbConn) << std::endl;
        return;
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus id data to statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    const char* insertSQL = R"(
        INSERT INTO word_list_per_file (group_id, file_id, word, count) VALUES (?, ?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing insert statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    // Start a transaction to speed up batch inserts
    int exit_code = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (exit_code != SQLITE_OK) {
        std::cerr << "Error starting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        return;
    }

    // Execute the query and insert the results into the new table
    while (sqlite3_step(statement) == SQLITE_ROW) {
        int group_id = sqlite3_column_int(statement, 0);
        int file_id = sqlite3_column_int(statement, 1);
        const char* word = reinterpret_cast<const char*>(sqlite3_column_text(statement, 2));
        int count = sqlite3_column_int(statement, 3);

        if (sqlite3_bind_int(insertStatement, 1, group_id) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 2, file_id) != SQLITE_OK ||
            sqlite3_bind_text(insertStatement, 3, word, -1, SQLITE_STATIC) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 4, count) != SQLITE_OK
        ) {
            std::cerr << "Error binding values to insert statement: " << sqlite3_errmsg(dbConn) << std::endl;
            continue;
        }
        if (sqlite3_step(insertStatement) != SQLITE_DONE) {
            std::cerr << "Error executing insert statement: " << sqlite3_errmsg(dbConn) << std::endl;
        }
        sqlite3_reset(insertStatement);
    }
    // Commit the transaction
    if (sqlite3_exec(dbConn, "COMMIT;", nullptr, nullptr, nullptr) != SQLITE_OK) {
        std::cerr << "Error committing transaction: " << sqlite3_errmsg(dbConn) << std::endl;
    }
    // Finalize the statements
    sqlite3_finalize(statement);
    sqlite3_finalize(insertStatement);
    return;
}

