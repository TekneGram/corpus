#include "StmtGuard.h"

StmtGuard::StmtGuard(sqlite3_stmt* stmt)
    : stmt(stmt)
{
}

StmtGuard::~StmtGuard()
{
    if (stmt) {
        sqlite3_finalize(stmt);
    }
}

sqlite3_stmt* StmtGuard::get() const
{
    return stmt;
}