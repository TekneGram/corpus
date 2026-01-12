#include "TransactionGuard.h"
#include <stdexcept>

TransactionGuard:: TransactionGuard(sqlite3* db) : db(db), committed(false)
{
    sqlite3_exec(db, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
}

void TransactionGuard::commit()
{
    if (!committed) {
        sqlite3_exec(db, "COMMIT", nullptr, nullptr, nullptr);
        committed = true;
    }
}

TransactionGuard::~TransactionGuard()
{
    if(!committed) {
        sqlite3_exec(db, "ROLLBACK;", nullptr, nullptr, nullptr);
    }
}