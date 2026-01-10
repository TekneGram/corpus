#pragma once
#include <sqlite3.h>

class TransactionGuard
{
    public:
        explicit TransactionGuard(sqlite3* db);
        ~TransactionGuard();

        void commit();

        TransactionGuard(const TransactionGuard&) = delete;
        TransactionGuard& operator=(const TransactionGuard&) = delete;

    private:
        sqlite3* db;
        bool committed;
};