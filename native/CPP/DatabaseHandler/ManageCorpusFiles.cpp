#include "DatabaseHandler.h"
#include "TransactionGuard.h"
#include "StmtGuard.h"
#include "../corpusAnalysis/CorpusAnalyzer.h"

#include <stdexcept>

CorpusMetadata::CorpusFile 
DatabaseHandler::uploadFileContent(const int& group_id,
                                   const std::string& file_content,
                                   const std::string& file_name)
{
    // One atomic domain operation
    TransactionGuard txn(dbConn);

    // =========================
    // 1. Parse file content
    // =========================
    std::vector<std::string> wordlist;
    std::vector<std::string> collList;
    std::vector<std::string> threeBundleList;
    std::vector<std::string> fourBundleList;

    CorpusAnalyzer analyzer;
    analyzer.parseText(
        file_content,
        wordlist,
        collList,
        threeBundleList,
        fourBundleList
    );

    // =========================
    // 2. Insert file metadata
    // =========================
    sqlite3_stmt* rawFileStmt = nullptr;
    const char* fileSql =
        "INSERT INTO files (file_name, group_id) VALUES (?, ?);";

    if (sqlite3_prepare_v2(dbConn, fileSql, -1, &rawFileStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    StmtGuard fileStmt(rawFileStmt);

    if (sqlite3_bind_text(
            fileStmt.get(), 1,
            file_name.c_str(), -1,
            SQLITE_TRANSIENT) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    if (sqlite3_bind_int(fileStmt.get(), 2, group_id) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    if (sqlite3_step(fileStmt.get()) != SQLITE_DONE)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    int file_id = static_cast<int>(sqlite3_last_insert_rowid(dbConn));
    if (file_id <= 0)
        throw std::runtime_error("Failed to retrieve file_id");

    // =========================
    // 3. Insert full text
    // =========================
    insertFileText(group_id, file_id, file_content);

    // =========================
    // 4. Batch inserts
    // =========================
    batchInsert(group_id, wordlist,       file_id, "words",     "word");
    batchInsert(group_id, collList,       file_id, "colls",     "coll");
    batchInsert(group_id, threeBundleList,file_id, "threeBuns", "threeBun");
    batchInsert(group_id, fourBundleList, file_id, "fourBuns",  "fourBun");

    // Commit everything
    txn.commit();

    CorpusMetadata::CorpusFile cf = {
        file_id,
        file_name
    };

    return cf;
}

void DatabaseHandler::insertFileText(const int& group_id, const int& file_id, const std::string& file_content)
{
    sqlite3_stmt* rawStmt = nullptr;
    const char* sql =
        "INSERT INTO corpus_file_text (text, group_id, file_id) "
        "VALUES (?, ?, ?);";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    StmtGuard stmt(rawStmt);

    if (sqlite3_bind_text(
            stmt.get(), 1,
            file_content.c_str(), -1,
            SQLITE_TRANSIENT) != SQLITE_OK ||
        sqlite3_bind_int(stmt.get(), 2, group_id) != SQLITE_OK ||
        sqlite3_bind_int(stmt.get(), 3, file_id) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    if (sqlite3_step(stmt.get()) != SQLITE_DONE)
        throw std::runtime_error(sqlite3_errmsg(dbConn));
}

void DatabaseHandler::batchInsert(const int& group_id,
                                    const std::vector<std::string>& data,
                                    const int& file_id,
                                    const std::string& table_name,
                                    const std::string& col_name)
{
    sqlite3_stmt* rawStmt = nullptr;
    std::string sql =
        "INSERT INTO " + table_name +
        " (group_id, file_id, " + col_name + ") VALUES (?, ?, ?);";

    if (sqlite3_prepare_v2(dbConn, sql.c_str(), -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    StmtGuard stmt(rawStmt);

    for (const auto& item : data) {
        if (sqlite3_bind_int(stmt.get(), 1, group_id) != SQLITE_OK ||
            sqlite3_bind_int(stmt.get(), 2, file_id) != SQLITE_OK ||
            sqlite3_bind_text(
                stmt.get(), 3,
                item.c_str(), -1,
                SQLITE_TRANSIENT) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        if (sqlite3_step(stmt.get()) != SQLITE_DONE)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        sqlite3_reset(stmt.get());
    }
}

CorpusMetadata::DeleteFileResult DatabaseHandler::deleteAFile(const int& file_id)
{
    // One atomic domain operation
    TransactionGuard txn(dbConn);

    CorpusMetadata::DeleteFileResult result{};
    result.fileDeleted  = false;
    result.groupDeleted = false;

    /* =========================
       Step 1: Find group_id
       ========================= */

    int group_id = -1;

    {
        sqlite3_stmt* rawStmt = nullptr;
        const char* sql =
            "SELECT group_id FROM files WHERE id = ?;";

        if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        StmtGuard stmt(rawStmt);

        if (sqlite3_bind_int(stmt.get(), 1, file_id) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        int rc = sqlite3_step(stmt.get());
        if (rc == SQLITE_ROW) {
            group_id = sqlite3_column_int(stmt.get(), 0);
        } else {
            throw std::runtime_error("File not found");
        }
    }

    result.groupId = group_id;

    /* =========================
       Step 2: Delete file
       ========================= */

    {
        sqlite3_stmt* rawStmt = nullptr;
        const char* sql =
            "DELETE FROM files WHERE id = ?;";

        if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        StmtGuard stmt(rawStmt);

        if (sqlite3_bind_int(stmt.get(), 1, file_id) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        if (sqlite3_step(stmt.get()) != SQLITE_DONE)
            throw std::runtime_error(sqlite3_errmsg(dbConn));
    }

    result.fileDeleted = true;

    /* =========================
       Step 3: Check remaining files
       ========================= */

    int remainingFiles = 0;

    {
        sqlite3_stmt* rawStmt = nullptr;
        const char* sql =
            "SELECT COUNT(*) FROM files WHERE group_id = ?;";

        if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        StmtGuard stmt(rawStmt);

        if (sqlite3_bind_int(stmt.get(), 1, group_id) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        if (sqlite3_step(stmt.get()) == SQLITE_ROW)
            remainingFiles = sqlite3_column_int(stmt.get(), 0);
    }

    /* =========================
       Step 4: Delete group if empty
       ========================= */

    if (remainingFiles == 0) {
        sqlite3_stmt* rawStmt = nullptr;
        const char* sql =
            "DELETE FROM corpus_group WHERE id = ?;";

        if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        StmtGuard stmt(rawStmt);

        if (sqlite3_bind_int(stmt.get(), 1, group_id) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        if (sqlite3_step(stmt.get()) != SQLITE_DONE)
            throw std::runtime_error(sqlite3_errmsg(dbConn));

        result.groupDeleted = true;
    }

    /* =========================
       Commit
       ========================= */

    txn.commit();

    result.success = true;
    result.message = result.groupDeleted
        ? "File deleted and subcorpus removed because it became empty."
        : "File deleted successfully.";

    return result;
}

CorpusMetadata::CorpusFileText DatabaseHandler::getFileText(const int& file_id)
{
    sqlite3_stmt* rawStmt = nullptr;
    const char* sql =
        "SELECT text FROM corpus_file_text WHERE file_id = ?;";

    // Prepare
    if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    // Statement RAII
    StmtGuard stmt(rawStmt);

    // Bind parameter
    if (sqlite3_bind_int(stmt.get(), 1, file_id) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    // Execute
    int rc = sqlite3_step(stmt.get());

    if (rc == SQLITE_ROW) {
        const char* text =
            reinterpret_cast<const char*>(
                sqlite3_column_text(stmt.get(), 0)
            );

        CorpusMetadata::CorpusFileText cft = {
            file_id,
            text ? text : ""
        };

        return cft;
    }

    if (rc == SQLITE_DONE) {
        // No row found → return empty text (by design)
        CorpusMetadata::CorpusFileText cft = {
            file_id,
            ""
        };

        return cft;
    }

    // Any other SQLite state is an error
    throw std::runtime_error(sqlite3_errmsg(dbConn));
}