#include "DatabaseHandler.h"
#include "TransactionGuard.h"
#include "StmtGuard.h"

#include <stdexcept>

CorpusMetadata::SubCorpus DatabaseHandler::createCorpusGroup(const int& corpus_id, const std::string& group_name)
{
    TransactionGuard txn(dbConn);

    sqlite3_stmt* rawStmt = nullptr;
    const char* sql =
        "INSERT INTO corpus_group (group_name, corpus_id) VALUES (?, ?);";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(std::string("Prepare failed: ") + sqlite3_errmsg(dbConn));

    StmtGuard stmt(rawStmt);

    if (sqlite3_bind_text(
            stmt.get(),
            1,
            group_name.c_str(),
            -1,
            SQLITE_TRANSIENT
        ) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind string failed: ") + sqlite3_errmsg(dbConn));

    if (sqlite3_bind_int(stmt.get(), 2, corpus_id) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind int failed: ") + sqlite3_errmsg(dbConn));

    if (sqlite3_step(stmt.get()) != SQLITE_DONE)
        throw std::runtime_error(std::string("Insert failed: ") + sqlite3_errmsg(dbConn));

    int group_id = static_cast<int>(sqlite3_last_insert_rowid(dbConn));
    if (group_id <= 0)
        throw std::runtime_error(
            "Failed to retrieve corpus group ID after insert"
        );

    txn.commit();

    CorpusMetadata::SubCorpus newSubCorpus{
        group_id,
        group_name
    };

    return newSubCorpus;
}

CorpusMetadata::SubCorpus DatabaseHandler::updateCorpusGroupName(const int& group_id, const std::string& group_name)
{
    TransactionGuard txn(dbConn);

    sqlite3_stmt* rawStmt = nullptr;
    const char* sql =
        "UPDATE corpus_group SET group_name = ? WHERE id = ?;";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(std::string("Prepare failed: ") + sqlite3_errmsg(dbConn));

    StmtGuard stmt(rawStmt);

    if (sqlite3_bind_text(
            stmt.get(),
            1,
            group_name.c_str(),
            -1,
            SQLITE_TRANSIENT
        ) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind string failed: ") + sqlite3_errmsg(dbConn));

    if (sqlite3_bind_int(stmt.get(), 2, group_id) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind int failed: ") + sqlite3_errmsg(dbConn));

    if (sqlite3_step(stmt.get()) != SQLITE_DONE)
        throw std::runtime_error(std::string("Update failed: ") + sqlite3_errmsg(dbConn));

    txn.commit();

    CorpusMetadata::SubCorpus sc = {
        group_id,
        group_name
    };

    return sc;
}

CorpusMetadata::DeleteSubCorpusResult DatabaseHandler::deleteSubcorpus(const int& group_id)
{
    TransactionGuard txn(dbConn);

    CorpusMetadata::DeleteSubCorpusResult result{};
    result.success = false;
    result.groupId = -1;
    result.message = "";

    sqlite3_stmt* rawStmt = nullptr;
    const char* sql =
        "DELETE FROM corpus_group WHERE id = ? RETURNING id;";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(std::string("Prepare failed: ") + sqlite3_errmsg(dbConn));

    StmtGuard stmt(rawStmt);

    if (sqlite3_bind_int(stmt.get(), 1, group_id) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind int failed: ") + sqlite3_errmsg(dbConn));

    int deletedId = -1;
    int rc = sqlite3_step(stmt.get());
    if (rc == SQLITE_ROW) {
        deletedId = sqlite3_column_int(stmt.get(), 0);
    } else if (rc != SQLITE_DONE) {
        throw std::runtime_error(std::string("Delete failed: ") + sqlite3_errmsg(dbConn));
    }

    result.success = (deletedId != -1);
    result.groupId = deletedId;
    result.message = (deletedId != -1) ? "Your subcorpus was deleted" : "Failed to delete your subcorpus";

    txn.commit();

    return result;
}