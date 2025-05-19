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
        throw std::runtime_error("Error: could not prepare select statement when checking for files in the corpus.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id" << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not bind parameters in checkCorpusFilesExist.");
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
        throw std::runtime_error("Error: could not prepare statement in checkCorpusPreppedStatus.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id" << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not bind parameters in checkCorpusPreppedStatus.");
    }

    if (sqlite3_bind_text(statement, 2, analysis_type.c_str(), -1, SQLITE_TRANSIENT) != SQLITE_OK) {
        std::cerr << "Error binding the analysis_type" << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not bind parameters in checkCorpusPreppedStatus.");
    }

    int rc = sqlite3_step(statement);
    std::cerr << "This is rc: " << rc << std::endl;
    if (rc == SQLITE_ROW) {
        //const unsigned char* analysisTypeText = sqlite3_column_text(statement, 0);
        if (sqlite3_column_type(statement, 0) != SQLITE_NULL) {
            const unsigned char* analysisTypeText = sqlite3_column_text(statement, 0);
            std::string typeStr = reinterpret_cast<const char *>(analysisTypeText);
            result.analysis_type = SummarizerMetadata::parseAnalysisType(typeStr.c_str());
        }
        if (sqlite3_column_type(statement, 1) != SQLITE_NULL) {
            result.up_to_date = sqlite3_column_int(statement, 1);
        }
    } else if (rc != SQLITE_DONE) {
        std::cerr << "Error stepping through results of checking the corpus prepped status: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Error: could not step through results in checkCorpusPreppedStatus.");
    }
    
    sqlite3_finalize(statement);
    return result;
}

SummarizerMetadata::CorpusPreppedStatus DatabaseSummarizer::updateCorpusPreppedStatus(const int& corpus_id, std::string& analysis_type, bool to_be_updated)
{
    sqlite3_extended_result_codes(dbConn, 1);
    sqlite3_exec(dbConn, "PRAGMA foreign_keys = ON;", nullptr, nullptr, nullptr);

    sqlite3_stmt* statement;
    const char* sql = R"(
        UPDATE corpus_prepped_status
        SET up_to_date = ?
        WHERE corpus_id = ? AND analysis_type = ?;
    )";

    SummarizerMetadata::CorpusPreppedStatus result;
    result.corpus_id = corpus_id;
    result.analysis_type = SummarizerMetadata::AnalysisType::Unknown;
    result.up_to_date = -1;

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement to insert into corpusPreppedStatus:" << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Update failed at preparing sqlite3 statement."); 
    }

    if (sqlite3_bind_int(statement, 1, static_cast<int>(to_be_updated)) != SQLITE_OK ||
        sqlite3_bind_int(statement, 2, corpus_id) != SQLITE_OK ||
        sqlite3_bind_text(statement, 3, analysis_type.c_str(), -1, SQLITE_TRANSIENT) != SQLITE_OK
    ) {
        std::cerr << "Error binding parameters: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Update failed at binding sqlite3 parameters.");
    }

    int rc = sqlite3_step(statement);
    if (rc != SQLITE_DONE) {
        std::cerr << "Error executing UPDATE statement tp corpusPreppedStatus" << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Update failed at sqlite3 execution.");
    }

    // Check that there were changes to the database.
    int changes = sqlite3_changes(dbConn);
    if (changes == 0) {
        std::cerr << "Warning: No rows updated in corpusPreppedStatus table!" << std::endl;
        throw std::runtime_error("There must have been a silent fail somewhere because the database was not updated");
    }

    // If the update was successful, clean up and send back
    // the up_to_date status (true or false) and the analysis_type
    sqlite3_finalize(statement);

    result.analysis_type = SummarizerMetadata::parseAnalysisType(analysis_type.c_str());
    result.up_to_date = to_be_updated;
    return result;
}

SummarizerMetadata::CorpusPreppedStatus DatabaseSummarizer::insertCorpusPreppedStatus(const int& corpus_id, std::string& analysis_type)
{
    sqlite3_extended_result_codes(dbConn, 1);
    sqlite3_exec(dbConn, "PRAGMA foreign_keys = ON;", nullptr, nullptr, nullptr);

    bool up_to_date = true;
    const char* sql = R"(
        INSERT INTO corpus_prepped_status (corpus_id, analysis_type, up_to_date)
        VALUES (?, ?, ?);
    )";

    SummarizerMetadata::CorpusPreppedStatus result;
    result.corpus_id = corpus_id;
    result.analysis_type = SummarizerMetadata::parseAnalysisType(analysis_type.c_str());
    result.up_to_date = 1; // This is set to "true" since inserting means this is the first time to count the words in the corpus

    sqlite3_stmt* statement;

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing insert for corpusPreppedStatus: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Prepare failed in corpusPreppedStatus.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK ||
        sqlite3_bind_text(statement, 2, analysis_type.c_str(), -1, SQLITE_TRANSIENT) != SQLITE_OK ||
        sqlite3_bind_int(statement, 3, true) != SQLITE_OK
    ) {
        std::cerr << "Error binding parameters: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Bind failed in corpusPreppedStatus.");
    }

    int rc = sqlite3_step(statement);
    if (rc != SQLITE_DONE) {
        std::cerr << "Error inserting data into corpusPreppedStatus table: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Insert failed in corpusPreppedStatus.");
    }

    // Check that there were changes to the database.
    int changes = sqlite3_changes(dbConn);
    if (changes == 0) {
        std::cerr << "Warning: No rows updated in corpusPreppedStatus table!" << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Nothing entered into the database table corpus_prepped_status.");
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
        throw std::runtime_error("Error: could not prepare statement in countWordsPerFile.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not bind parameters in countWordsPerFile.");
    }

    const char* insertSQL = R"(
        INSERT INTO word_counts_per_file (group_id, file_id, type_count, token_count) VALUES (?, ?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing INSERT statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not prepare insert statement in countWordsPerFile.");
    }

    // Begin transaction
    int rc = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error starting transaction (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        throw std::runtime_error("Error: could not complete transaction in countWordsPerFile.");
    }

    while (sqlite3_step(statement) == SQLITE_ROW) {
        int group_id = sqlite3_column_int(statement, 0);
        int file_id = sqlite3_column_int(statement, 1);
        int type_count = sqlite3_column_int(statement, 2);
        int token_count = sqlite3_column_int(statement, 3);

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
        throw std::runtime_error("Error: could not commit transition in countWordsPerFile");
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
        throw std::runtime_error("Error: could not prepare statement in createWordListPerFile.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus id data to statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not bind parameter in createWordListPerFile.");
    }

    const char* insertSQL = R"(
        INSERT INTO word_list_per_file (group_id, file_id, word, count) VALUES (?, ?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing insert statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not prepare insert statement in createWordListPerFile.");
    }

    // Start a transaction to speed up batch inserts
    int exit_code = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (exit_code != SQLITE_OK) {
        std::cerr << "Error starting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        throw std::runtime_error("Error: could not begin transaction in createWordListPerFile.");
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
        throw std::runtime_error("Error: could not commit transaction in createWordListPerFile.");
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
        throw std::runtime_error("Error: could not prepare statement in countWordsPerGroup.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id to SELECT: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not bind paramter in countWordsPerGroup.");
    }

    const char* insertSQL = R"(
        INSERT INTO word_counts_per_group (group_id, type_count, token_count) VALUES (?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing INSERT statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not prepare insert statement in countWordsPerGroup.");
    }

    // Begin transaction
    int rc = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error starting transaction (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        throw std::runtime_error("Error: could not begin transaction in countWordsPerGroup.");
    }

    // Step through SELECT results and insert into destination table
    while (sqlite3_step(statement) == SQLITE_ROW) {
        int group_id = sqlite3_column_int(statement, 0);
        int type_count = sqlite3_column_int(statement, 1);
        int token_count = sqlite3_column_int(statement, 2);

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
        throw std::runtime_error("Error: could not commit transaction in countWordsPerGroup.");
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
        throw std::runtime_error("Error: could not prepare statement in createWordListPerGroup.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus id data to statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not bind parameters in createWordListPerGroup.");
    }

    const char* insertSQL = R"(
        INSERT INTO word_list_per_group (group_id, word, count) VALUES (?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing insert statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not prepare insert statement in createWordListPerGroup.");
    }

    // Start a transaction to speed up batch inserts
    int exit_code = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (exit_code != SQLITE_OK) {
        std::cerr << "Error starting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        throw std::runtime_error("Error: could not begin transaction in createWordListPerGroup.");
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
        throw std::runtime_error("Error: could not commit transaction in createWordListPerGroup.");
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
        throw std::runtime_error("Error: could not prepare statement in countWordsPerCorpus.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus_id to SELECT: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not binding parameters in countWordsPerCorpus.");
    }

    const char* insertSQL = R"(
        INSERT INTO word_counts_per_corpus (corpus_id, type_count, token_count) VALUES (?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing INSERT statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not prepare insert statement in countWordsPerCorpus.");
    }

    // Begin transaction
    int rc = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error starting transaction (code " << rc << "): " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        throw std::runtime_error("Error: could not start transaction in countWordsPerCorpus.");
    }

    // Execute query and insert
    if (sqlite3_step(statement) == SQLITE_ROW) {
        int type_count = sqlite3_column_int(statement, 0);
        int token_count = sqlite3_column_int(statement, 1);

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
        throw std::runtime_error("Error: could not commit transaction in countWordsPerCorpus.");
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
        throw std::runtime_error("Error: could not prepare statement in createWordListPerCorpus.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Error binding corpus id data to statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not bind parameters in createWordListPerCorpus.");
    }

    const char* insertSQL = R"(
        INSERT INTO word_list_per_corpus (corpus_id, word, count) VALUES (?, ?, ?);
    )";

    sqlite3_stmt* insertStatement;
    if (sqlite3_prepare_v2(dbConn, insertSQL, -1, &insertStatement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing insert statement: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error: could not prepare insert statement in createWordListPerCorpus.");
    }

    // Start a transaction to speed up batch inserts
    int exit_code = sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    if (exit_code != SQLITE_OK) {
        std::cerr << "Error starting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        sqlite3_finalize(insertStatement);
        throw std::runtime_error("Error: could not begin transaction in createWordListPerCorpus.");
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
        throw std::runtime_error("Error: could not commit transaction in createWordListPerCorpus.");
    }
    // Finalize the statements
    sqlite3_finalize(statement);
    sqlite3_finalize(insertStatement);
    return;
}

// This function deletes the word counts per file for the given corpus_id
void DatabaseSummarizer::deleteWordsPerFile(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        DELETE FROM 
            word_counts_per_file
        WHERE
            group_id IN (
                SELECT id FROM corpus_group WHERE corpus_id = ?;
            )
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare DELETE statement for deleting words per file: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare delete statement in deleteWordsPerFile.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id to the statement: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to bind corpus id to the statement in deleteWordsPerFile.");
    }

    if (sqlite3_step(statement) != SQLITE_DONE) {
        std::cerr << "Failed to execute delete in deleteWordsPerFile: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to execute the delete in deleteWordsPerFile.");
    }

    sqlite3_finalize(statement);

}

void DatabaseSummarizer::deleteWordListPerFile(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        DELETE FROM 
            word_list_per_file
        WHERE
            group_id IN (
                SELECT id FROM corpus_group WHERE corpus_id = ?;
            )
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare DELETE statement for deleting word list per file: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare delete statement in deleteWordListPerFile.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id to the statement: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to bind corpus id to the statement in deleteWordListPerFile.");
    }

    if (sqlite3_step(statement) != SQLITE_DONE) {
        std::cerr << "Failed to execute delete in deleteWordListPerFile: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to execute the delete in deleteWordListPerFile.");
    }

    sqlite3_finalize(statement);

}

void DatabaseSummarizer::deleteWordsPerGroup(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        DELETE FROM 
            word_counts_per_group
        WHERE
            group_id IN (
                SELECT id FROM corpus_group WHERE corpus_id = ?;
            )
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare DELETE statement for deleting word counts per group: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare delete statement in deleteWordsPerGroup.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id to the statement: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to bind corpus id to the statement in deleteWordsPerGroup.");
    }

    if (sqlite3_step(statement) != SQLITE_DONE) {
        std::cerr << "Failed to execute delete in deleteWordsPerGroup: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to execute the delete in deleteWordsPerGroup.");
    }

    sqlite3_finalize(statement);

}

void DatabaseSummarizer::deleteWordListPerGroup(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        DELETE FROM 
            word_list_per_group
        WHERE
            group_id IN (
                SELECT id FROM corpus_group WHERE corpus_id = ?;
            )
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare DELETE statement for deleting word list per group: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare delete statement in deleteWordListPerGroup.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id to the statement: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to bind corpus id to the statement in deleteWordListPerGroup.");
    }

    if (sqlite3_step(statement) != SQLITE_DONE) {
        std::cerr << "Failed to execute delete in deleteWordListPerGroup: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to execute the delete in deleteWordListPerGroup.");
    }

    sqlite3_finalize(statement);

}

void DatabaseSummarizer::deleteWordsPerCorpus(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        DELETE FROM 
            word_counts_per_corpus
        WHERE
            corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare DELETE statement for deleting word counts per corpus: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare delete statement in deleteWordsPerCorpus.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id to the statement: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to bind corpus id to the statement in deleteWordsPerCorpus.");
    }

    if (sqlite3_step(statement) != SQLITE_DONE) {
        std::cerr << "Failed to execute delete in deleteWordsPerCorpus: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to execute the delete in deleteWordsPerCorpus.");
    }

    sqlite3_finalize(statement);

}

void DatabaseSummarizer::deleteWordListPerCorpus(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        DELETE FROM 
            word_list_per_corpus
        WHERE
            corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare DELETE statement for deleting word list per corpus: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare delete statement in deleteWordListPerCorpus.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id to the statement: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to bind corpus id to the statement in deleteWordsPerCorpus.");
    }

    if (sqlite3_step(statement) != SQLITE_DONE) {
        std::cerr << "Failed to execute delete in deleteWordsPerCorpus: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to execute the delete in deleteWordsPerCorpus.");
    }

    sqlite3_finalize(statement);

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

void DatabaseSummarizer::recountCorpusWords(const int& corpus_id)
{
    // Delete all the current words counts associated with the corpus
    if (sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr) != SQLITE_OK) {
        std::cerr << "Error starting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Could not start the transaction to delete word counts from the database tables.");
    }
    try {
        deleteWordsPerFile(corpus_id);
        deleteWordListPerFile(corpus_id);
        deleteWordsPerCorpus(corpus_id);
        deleteWordListPerGroup(corpus_id);
        deleteWordsPerCorpus(corpus_id);
        deleteWordListPerCorpus(corpus_id);

        if (sqlite3_exec(dbConn, "COMMIT;", nullptr, nullptr, nullptr) != SQLITE_OK) {
            std::cerr << "Error commiting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
            throw std::runtime_error("Transaction commit failed");
        }

    } catch (const std::exception& err) {
        std::cerr << "Transaction failed, rolling back: " << err.what() << std::endl;
        sqlite3_exec(dbConn, "ROLLBACK;", nullptr, nullptr, nullptr);
        throw; //rethrow so the caller knows it failed.
    }

    // Now count the words again using the method from above.
    DatabaseSummarizer::summarizeCorpusWords(corpus_id);
    
}

/**
 * Retrieve WORD COUNTS
 */

SummarizerMetadata::WordCountsPerCorpus DatabaseSummarizer::fetchWordCountsPerCorpus(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT corpus_id, type_count, token_count
        FROM word_counts_per_corpus
        WHERE corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare SELECT statement for fetching word counts per corpus: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare statement for fetching word counts per corpus.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id to the statement: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to bind corpus id to the statement in fetchWordCountsPerCorpus.");
    }

    SummarizerMetadata::WordCountsPerCorpus result;
    int stepResult = sqlite3_step(statement);
    if (stepResult == SQLITE_ROW) {
        result.corpus_id = sqlite3_column_int(statement, 0);
        result.type_count = sqlite3_column_int(statement, 1);
        result.token_count = sqlite3_column_int(statement, 2);
    } else if (stepResult == SQLITE_DONE) {
        sqlite3_finalize(statement);
        throw std::runtime_error("No data found for the given corpus_id in fetchWordCountsPerCorpus.");
    } else {
        std::cerr << "Failed to step through the result: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Failed to step through the results in fetchWordCountsPerCorpus.");
    }

    sqlite3_finalize(statement);
    return result;
}

SummarizerMetadata::WordCountsPerGroup DatabaseSummarizer::fetchWordCountsPerGroup(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT group_id, type_count, token_count
        FROM word_counts_per_group
        JOIN corpus_group
        ON corpus_group.id = word_counts_per_group.group_id
        WHERE corpus_group.corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare SELECT statement for fetching word counts per group: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare statement for fetching word counts per group.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id to the statement: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to bind corpus id to the statement in fetchWordCountsPerGroup.");
    }

    SummarizerMetadata::WordCountsPerGroup result;
    result.corpus_id = corpus_id;

    while (sqlite3_step(statement) == SQLITE_ROW) {
        SummarizerMetadata::GroupWordCounts groupData;
        groupData.group_id = sqlite3_column_int(statement, 0);
        groupData.type_count = sqlite3_column_int(statement, 1);
        groupData.token_count = sqlite3_column_int(statement, 2);

        result.group_word_counts.push_back(groupData);
    }

    // Check for errors during stepping
    if (sqlite3_errcode(dbConn) != SQLITE_OK && sqlite3_errcode(dbConn) != SQLITE_DONE) {
        std::cerr << "Error occurred during result iteration: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Error occurred during result iteration in fetchWordCountsPerGroup.");
    }

    sqlite3_finalize(statement);
    return result;
}

SummarizerMetadata::WordCountsPerFile DatabaseSummarizer::fetchWordCountsPerFile(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT file_id, group_id, type_count, token_count
        FROM word_counts_per_file
        JOIN corpus_group
        ON corpus_group.id = word_counts_per_file.group_id
        WHERE corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare SELECT statement for fetching word counts per file: "
                  << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare statement for fetching word counts per file.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id to the statement: "
                  << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Failed to bind corpus id to the statement in fetchWordCountsPerFile.");
    }

    SummarizerMetadata::WordCountsPerFile result;
    result.corpus_id = corpus_id;

    while (sqlite3_step(statement) == SQLITE_ROW) {
        SummarizerMetadata::FileWordCounts fileData;
        fileData.file_id     = sqlite3_column_int(statement, 0);
        fileData.group_id    = sqlite3_column_int(statement, 1);
        fileData.type_count  = sqlite3_column_int(statement, 2);
        fileData.token_count = sqlite3_column_int(statement, 3);

        result.file_word_counts.push_back(fileData);
    }

    sqlite3_finalize(statement);
    return result;
}


SummarizerMetadata::WordCounts DatabaseSummarizer::fetchWordCounts(const int& corpus_id)
{
    // Get all current word counts associated with the current corpus.
    if (sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr) != SQLITE_OK) {
        std::cerr << "Error starting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Could not start the transaction to fetch word counts from the database tables.");
    }

    // Declare the variable to be returned
    SummarizerMetadata::WordCounts wordCounts;

    try {
        SummarizerMetadata::WordCountsPerCorpus wordCountsPerCorpus = fetchWordCountsPerCorpus(corpus_id);
        SummarizerMetadata::WordCountsPerGroup wordCountsPerGroup =  fetchWordCountsPerGroup(corpus_id);
        SummarizerMetadata::WordCountsPerFile wordCountsPerFile =  fetchWordCountsPerFile(corpus_id);

        wordCounts.word_counts_per_corpus = wordCountsPerCorpus;
        wordCounts.word_counts_per_group = wordCountsPerGroup;
        wordCounts.word_counts_per_file = wordCountsPerFile;

        if (sqlite3_exec(dbConn, "COMMIT;", nullptr, nullptr, nullptr) != SQLITE_OK) {
            std::cerr << "Error commiting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
            throw std::runtime_error("Transaction commit failed");
        }

    } catch (const std::exception& err) {
        std::cerr << "Transaction failed, rolling back: " << err.what() << std::endl;
        sqlite3_exec(dbConn, "ROLLBACK;", nullptr, nullptr, nullptr);
        throw; //rethrow so the caller knows it failed.
    }

    return wordCounts;
}

/**
 * Retrieve WORD LISTS
 */

 SummarizerMetadata::WordListPerCorpus DatabaseSummarizer::fetchWordListPerCorpus(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT id, word, count
        FROM word_list_per_corpus
        WHERE corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare SELECT statement for word_list_per_corpus: "
                  << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare statement for fetchWordListPerCorpus.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id: "
                  << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Failed to bind corpus id in fetchWordListPerCorpus.");
    }

    SummarizerMetadata::WordListPerCorpus result;
    result.corpus_id = corpus_id;

    while (sqlite3_step(statement) == SQLITE_ROW) {
        SummarizerMetadata::WordDataCorpus wordData;
        wordData.id    = sqlite3_column_int(statement, 0);
        wordData.word  = reinterpret_cast<const char*>(sqlite3_column_text(statement, 1));
        wordData.count = sqlite3_column_int(statement, 2);

        result.word.push_back(wordData);
    }

    sqlite3_finalize(statement);
    return result;
}

SummarizerMetadata::WordListPerGroup DatabaseSummarizer::fetchWordListPerGroup(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT word_list_per_group.id, word_list_per_group.group_id, word_list_per_group.word, word_list_per_group.count
        FROM word_list_per_group
        JOIN corpus_group ON corpus_group.id = word_list_per_group.group_id
        WHERE corpus_group.corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare SELECT statement for word_list_per_group: "
                  << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare statement for fetchWordListPerGroup.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id: "
                  << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Failed to bind corpus id in fetchWordListPerGroup.");
    }

    SummarizerMetadata::WordListPerGroup result;
    result.corpus_id = corpus_id;

    while (sqlite3_step(statement) == SQLITE_ROW) {
        SummarizerMetadata::WordDataGroup wordData;
        wordData.id       = sqlite3_column_int(statement, 0);
        wordData.group_id = sqlite3_column_int(statement, 1);
        wordData.word     = reinterpret_cast<const char*>(sqlite3_column_text(statement, 2));
        wordData.count    = sqlite3_column_int(statement, 3);

        result.word.push_back(wordData);
    }

    sqlite3_finalize(statement);
    return result;
}

SummarizerMetadata::WordListPerFile DatabaseSummarizer::fetchWordListPerFile(const int& corpus_id)
{
    sqlite3_stmt* statement;
    const char* sql = R"(
        SELECT word_list_per_file.id, word_list_per_file.group_id, word_list_per_file.file_id,
               word_list_per_file.word, word_list_per_file.count
        FROM word_list_per_file
        JOIN corpus_group ON corpus_group.id = word_list_per_file.group_id
        WHERE corpus_group.corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare SELECT statement for word_list_per_file: "
                  << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Failed to prepare statement for fetchWordListPerFile.");
    }

    if (sqlite3_bind_int(statement, 1, corpus_id) != SQLITE_OK) {
        std::cerr << "Failed to bind corpus id: "
                  << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        throw std::runtime_error("Failed to bind corpus id in fetchWordListPerFile.");
    }

    SummarizerMetadata::WordListPerFile result;
    result.corpus_id = corpus_id;

    while (sqlite3_step(statement) == SQLITE_ROW) {
        SummarizerMetadata::WordDataFile wordData;
        wordData.id       = sqlite3_column_int(statement, 0);
        wordData.group_id = sqlite3_column_int(statement, 1);
        wordData.file_id  = sqlite3_column_int(statement, 2);
        wordData.word     = reinterpret_cast<const char*>(sqlite3_column_text(statement, 3));
        wordData.count    = sqlite3_column_int(statement, 4);

        result.word.push_back(wordData);
    }

    sqlite3_finalize(statement);
    return result;
}

SummarizerMetadata::WordLists DatabaseSummarizer::fetchWordLists(const int& corpus_id)
{
    // Get all current word counts associated with the current corpus.
    if (sqlite3_exec(dbConn, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr) != SQLITE_OK) {
        std::cerr << "Error starting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
        throw std::runtime_error("Could not start the transaction to fetch word lists from the database tables.");
    }

    // Declare the variable to be returned
    SummarizerMetadata::WordLists wordLists;

    try {
        SummarizerMetadata::WordListPerCorpus wordListPerCorpus = fetchWordListPerCorpus(corpus_id);
        SummarizerMetadata::WordListPerGroup wordListPerGroup =  fetchWordListPerGroup(corpus_id);
        SummarizerMetadata::WordListPerFile wordListPerFile =  fetchWordListPerFile(corpus_id);

        wordLists.word_list_per_corpus = wordListPerCorpus;
        wordLists.word_list_per_group = wordListPerGroup;
        wordLists.word_list_per_file = wordListPerFile;

        if (sqlite3_exec(dbConn, "COMMIT;", nullptr, nullptr, nullptr) != SQLITE_OK) {
            std::cerr << "Error commiting transaction: " << sqlite3_errmsg(dbConn) << std::endl;
            throw std::runtime_error("Transaction commit failed");
        }

    } catch (const std::exception& err) {
        std::cerr << "Transaction failed, rolling back: " << err.what() << std::endl;
        sqlite3_exec(dbConn, "ROLLBACK;", nullptr, nullptr, nullptr);
        throw; //rethrow so the caller knows it failed.
    }

    return wordLists;
}
