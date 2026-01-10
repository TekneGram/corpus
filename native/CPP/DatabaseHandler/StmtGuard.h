#pragma once
#include <sqlite3.h>

class StmtGuard {
    public:
        explicit StmtGuard(sqlite3_stmt* stmt);
        ~StmtGuard();

        sqlite3_stmt* get() const;

        // non-copyable
        StmtGuard(const StmtGuard&) = delete;
        StmtGuard& operator=(const StmtGuard&) = delete;

    private:
        sqlite3_stmt* stmt;
};