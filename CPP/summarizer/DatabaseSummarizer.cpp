#include "DatabaseSummarizer.h"
#include <sqlite3.h>
#include <iostream>
#include "../lib/json.hpp"
#include "../CorpusMetadata.h"
#include "SummarizerMetadata.h"
#include "EnumHelpers.h"

DatabaseSummarizer::DatabaseSummarizer(sqlite3* db)
{
    dbConn = db;
}

SummarizerMetadata::HasFiles DatabaseSummarizer::checkCorpusFilesExist(const int& corpus_id)
{
    // Enable extended result codes for better error diagnostics
    sqlite3_extended_result_codes(dbConn, 1);

    // Enable foreign key constraints
    sqlite3_exec(dbConn, "PRAGMA foreign_keys = ON;", nullptr, nullptr, nullptr);

    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT 
            files.file_name
        FROM 
            files
        JOIN 
            corpus_group 
        ON 
            corpus_group.id = files.group_id
        WHERE 
            corpus_group.corpus_id = ?
        LIMIT 5;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing the SELECT statement to check for files in the corpus" << sqlite3_errmsg(dbConn) << std::endl;
        return {corpus_id, false};
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id" << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return {corpus_id, false};
    }

    int rowCount = 0;
    while (sqlite3_step(statement) == SQLITE_ROW) {
        ++rowCount;
    }

    sqlite3_finalize(statement);

    if (rowCount > 0) {
        return {corpus_id, true};
    } else {
        return {corpus_id, false};
    }
}

SummarizerMetadata::CorpusPreppedStatus DatabaseSummarizer::checkCorpusPreppedStatus(const int& corpus_id, std::string& analysis_type)
{
    // Enable extended result codes for better error diagnostics
    sqlite3_extended_result_codes(dbConn, 1);

    // Enable foreign key constraints
    sqlite3_exec(dbConn, "PRAGMA foreign_keys = ON;", nullptr, nullptr, nullptr);

    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT
            analysis_type, up_to_date
        FROM
            corpus_prepped_status
        WHERE
            corpus_id = ? AND analysis_type = ?
        ;
    )";

    SummarizerMetadata::CorpusPreppedStatus result;
    result.corpus_id = corpus_id;
    result.analysis_type = SummarizerMetadata::AnalysisType::Unknown;
    result.up_to_date = -1; // -1 = null - will be converted by JSON convert

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing the SELECT statement to check for files in the corpus" << sqlite3_errmsg(dbConn) << std::endl;
        return result;
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id" << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return result;
    }

    if (sqlite3_bind_text(statement, 2, analysis_type.c_str(), -1, SQLITE_TRANSIENT) != SQLITE_OK) {
        std::cerr << "Error binding the analysis_type" << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return result;
    }

    int rc = sqlite3_step(statement);
    if (rc == SQLITE_ROW) {
        const unsigned char* analysisTypeText = sqlite3_column_text(statement, 0);
        int upToDateValue = sqlite3_column_type(statement, 1) != SQLITE_NULL
                            ? sqlite3_column_int(statement, 1)
                            : -1;
        result.analysis_type = SummarizerMetadata::parseAnalysisType(reinterpret_cast<const char *>(analysisTypeText));
        result.up_to_date = upToDateValue;
    } else if (rc != SQLITE_DONE) {
        std::cerr << "Error stepping through results of checking the corpus prepped status: " << sqlite3_errmsg(dbConn) << std::endl;
        return result;
    }

    sqlite3_finalize(statement);
    return result;
}

void DatabaseSummarizer::countWordsPerFile(const int& corpus_id)
{
    // Enable extended result codes for better error diagnostics
    sqlite3_extended_result_codes(dbConn, 1);

    // Enable foreign key constraints
    sqlite3_exec(dbConn, "PRAGMA foreign_keys = ON;", nullptr, nullptr, nullptr);

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
        std::cerr << "Error preparing SELECT statement: " << sqlite3_errmsg(dbConn) << std::endl;
        return;
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    const char* insertSQL = R"(
        INSERT INTO word_counts_per_file (group_id, file_id, type_count, token_count) VALUES (?, ?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing INSERT statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    // Begin transaction
    int rc = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error starting transaction (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        return;
    }

    while (sqlite3_step(statement) == SQLITE_ROW) {
        int group_id = sqlite3_column_int(statement, 0);
        int file_id = sqlite3_column_int(statement, 1);
        int type_count = sqlite3_column_int(statement, 2);
        int token_count = sqlite3_column_int(statement, 3);

        std::cout << "Inserting: group_id=" << group_id
                  << ", file_id=" << file_id
                  << ", type_count=" << type_count
                  << ", token_count=" << token_count << std::endl;

        // Bind values
        if (sqlite3_bind_int(insertStatement, 1, group_id) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 2, file_id) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 3, type_count) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 4, token_count) != SQLITE_OK) {
            std::cerr << "Error binding values to INSERT: " << sqlite3_errmsg(dbConn) << std::endl;
            sqlite3_reset(insertStatement);
            continue;
        }

        // Execute insert
        rc = sqlite3_step(insertStatement);
        if (rc != SQLITE_DONE) {
            std::cerr << "Error executing INSERT (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
        }

        sqlite3_reset(insertStatement);
    }

    // Commit transaction
    rc = sqlite3_exec(dbConn, "COMMIT;", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error committing transaction (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
    }

    // Final cleanup
    sqlite3_finalize(statement);
    sqlite3_finalize(insertStatement);
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
        ORDER BY group_id, file_id, count DESC;
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

void DatabaseSummarizer::countWordsPerGroup(const int& corpus_id)
{
    // Enable extended error codes for better debugging
    sqlite3_extended_result_codes(dbConn, 1);

    // Enforce foreign key constraints
    sqlite3_exec(dbConn, "PRAGMA foreign_keys = ON;", nullptr, nullptr, nullptr);

    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT
            corpus_group.id AS group_id,
            COUNT(DISTINCT words.word) AS type_count,
            COUNT(*) AS token_count
        FROM
            corpus_group
        JOIN
            words ON corpus_group.id = words.group_id
        WHERE
            corpus_group.corpus_id = ?
        GROUP BY
            corpus_group.id;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing SELECT statement: " << sqlite3_errmsg(dbConn) << std::endl;
        return;
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id to SELECT: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    const char* insertSQL = R"(
        INSERT INTO word_counts_per_group (group_id, type_count, token_count) VALUES (?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing INSERT statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    // Begin transaction
    int rc = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error starting transaction (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        return;
    }

    // Step through SELECT results and insert into destination table
    while (sqlite3_step(statement) == SQLITE_ROW) {
        int group_id = sqlite3_column_int(statement, 0);
        int type_count = sqlite3_column_int(statement, 1);
        int token_count = sqlite3_column_int(statement, 2);

        std::cout << "Inserting: group_id=" << group_id
                  << ", type_count=" << type_count
                  << ", token_count=" << token_count << std::endl;

        // Bind insert values
        if (sqlite3_bind_int(insertStatement, 1, group_id) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 2, type_count) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 3, token_count) != SQLITE_OK) {
            std::cerr << "Error binding values to INSERT: " << sqlite3_errmsg(dbConn) << std::endl;
            sqlite3_reset(insertStatement);
            continue;
        }

        // Execute insert
        rc = sqlite3_step(insertStatement);
        if (rc != SQLITE_DONE) {
            std::cerr << "Error executing INSERT (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
        }

        sqlite3_reset(insertStatement);
    }

    // Commit transaction
    rc = sqlite3_exec(dbConn, "COMMIT;", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error committing transaction (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
    }

    // Final cleanup
    sqlite3_finalize(statement);
    sqlite3_finalize(insertStatement);
}

void DatabaseSummarizer::createWordListPerGroup(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT
            corpus_group.id AS group_id,
            words.word,
            COUNT(*) AS count
        FROM
            corpus_group
        JOIN
            words ON corpus_group.id = words.group_id
        WHERE
            corpus_group.corpus_id = ?
        GROUP BY corpus_group.id, words.word
        ORDER BY group_id, count DESC;
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
        INSERT INTO word_list_per_group (group_id, word, count) VALUES (?, ?, ?);
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
        const char* word = reinterpret_cast<const char*>(sqlite3_column_text(statement, 1));
        int count = sqlite3_column_int(statement, 2);

        if (sqlite3_bind_int(insertStatement, 1,
            group_id) != SQLITE_OK ||
            sqlite3_bind_text(insertStatement, 2, word, -1, SQLITE_STATIC) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 3, count) != SQLITE_OK
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

void DatabaseSummarizer::countWordsPerCorpus(const int& corpus_id)
{
    // Enable extended error reporting and enforce foreign keys
    sqlite3_extended_result_codes(dbConn, 1);
    sqlite3_exec(dbConn, "PRAGMA foreign_keys = ON;", nullptr, nullptr, nullptr);

    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT
            COUNT(DISTINCT words.word) AS type_count,
            COUNT(*) AS token_count
        FROM
            words
        JOIN
            corpus_group ON words.group_id = corpus_group.id
        WHERE
            corpus_group.corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing SELECT statement: " << sqlite3_errmsg(dbConn) << std::endl;
        return;
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id to SELECT: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    const char* insertSQL = R"(
        INSERT INTO word_counts_per_corpus (corpus_id, type_count, token_count) VALUES (?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing INSERT statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }

    // Begin transaction
    int rc = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error starting transaction (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        return;
    }

    // Execute query and insert
    if (sqlite3_step(statement) == SQLITE_ROW) {
        int type_count = sqlite3_column_int(statement, 0);
        int token_count = sqlite3_column_int(statement, 1);

        std::cout << "Inserting: corpus_id=" << corpus_id
                  << ", type_count=" << type_count
                  << ", token_count=" << token_count << std::endl;

        if (sqlite3_bind_int(insertStatement, 1, corpus_id) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 2, type_count) != SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 3, token_count) != SQLITE_OK) {
            std::cerr << "Error binding values to INSERT: " << sqlite3_errmsg(dbConn) << std::endl;
        } else if (sqlite3_step(insertStatement) != SQLITE_DONE) {
            std::cerr << "Error executing INSERT (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
        }
    } else {
        std::cerr << "No data returned from SELECT or error: " << sqlite3_errmsg(dbConn) << std::endl;
    }

    // Commit transaction
    rc = sqlite3_exec(dbConn, "COMMIT;", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error committing transaction (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
    }

    // Final cleanup
    sqlite3_finalize(statement);
    sqlite3_finalize(insertStatement);
}

void DatabaseSummarizer::createWordListPerCorpus(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT
            words.word,
            COUNT(*) AS count
        FROM
            words
        JOIN
            corpus_group ON words.group_id = corpus_group.id
        WHERE
            corpus_group.corpus_id = ?
        GROUP BY words.word
        ORDER BY count DESC;
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
        INSERT INTO word_list_per_corpus (corpus_id, word, count) VALUES (?, ?, ?);
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
        const char* word = reinterpret_cast<const char*>(sqlite3_column_text(statement, 0));
        int count = sqlite3_column_int(statement, 1);

        if (sqlite3_bind_int(insertStatement, 1,
            corpus_id) != SQLITE_OK ||
            sqlite3_bind_text(insertStatement, 2, word, -1, SQLITE_STATIC) !=
            SQLITE_OK ||
            sqlite3_bind_int(insertStatement, 3, count) != SQLITE_OK
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

// This function summarizes the entire corpus by calling the other functions.
void DatabaseSummarizer::summarizeCorpusWords(const int& corpus_id)
{
    countWordsPerFile(corpus_id);
    createWordListPerFile(corpus_id);
    countWordsPerGroup(corpus_id);
    createWordListPerGroup(corpus_id);
    countWordsPerCorpus(corpus_id);
    createWordListPerCorpus(corpus_id);
}