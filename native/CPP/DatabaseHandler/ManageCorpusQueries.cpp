#include "DatabaseHandler.h"
#include "TransactionGuard.h"
#include "StmtGuard.h"

#include <stdexcept>

CorpusMetadata::Corpus DatabaseHandler::createCorpusName(const int& project_id, const std::string& corpus_name)
{
    TransactionGuard txn(dbConn);

    sqlite3_stmt* rawStmt = nullptr;
    const char* sql = "INSERT INTO corpus (corpus_name, project_id) VALUES (?, ?);";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(std::string("Prepare failed: ") + sqlite3_errmsg(dbConn));

    StmtGuard stmt(rawStmt);

    // Bind parameters
    if (sqlite3_bind_text(
            stmt.get(),
            1,
            corpus_name.c_str(),
            -1,
            SQLITE_TRANSIENT
        ) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind text failed: ") + sqlite3_errmsg(dbConn));

    if (sqlite3_bind_int(stmt.get(), 2, project_id) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind int failed: ") + sqlite3_errmsg(dbConn));

    // Execute
    if (sqlite3_step(stmt.get()) != SQLITE_DONE)
        throw std::runtime_error(std::string("Insert failed: ") + sqlite3_errmsg(dbConn));

    // Retrieve generated ID
    int corpusId = static_cast<int>(sqlite3_last_insert_rowid(dbConn));
    if (corpusId <= 0)
        throw std::runtime_error(
            "Failed to retrieve corpus ID after inserting corpus"
        );

    // Commit only after *everything* succeeded
    txn.commit();

    CorpusMetadata::Corpus corpus = {
        corpusId,
        corpus_name
    };

    return corpus;
}

CorpusMetadata::Corpus DatabaseHandler::updateCorpusName(const int& corpus_id, const std::string& corpus_name)
{
    TransactionGuard txn(dbConn);

    sqlite3_stmt* rawStmt = nullptr;
    const char* sql =
        "UPDATE corpus SET corpus_name = ? WHERE id = ?;";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(std::string("Prepare failed: ") + sqlite3_errmsg(dbConn));

    StmtGuard stmt(rawStmt);

    if (sqlite3_bind_text(
            stmt.get(),
            1,
            corpus_name.c_str(),
            -1,
            SQLITE_TRANSIENT
        ) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind text failed: ") + sqlite3_errmsg(dbConn));

    if (sqlite3_bind_int(stmt.get(), 2, corpus_id) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind int failed: ") + sqlite3_errmsg(dbConn));

    if (sqlite3_step(stmt.get()) != SQLITE_DONE)
        throw std::runtime_error(std::string("Update failed: ") + sqlite3_errmsg(dbConn));

    txn.commit();

    CorpusMetadata::Corpus corpus = {
        corpus_id,
        corpus_name
    };

    return corpus;
}