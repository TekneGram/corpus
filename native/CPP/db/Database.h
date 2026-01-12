#pragma once

#include <sqlite3.h>
#include <string>

class Database {
    public:
        explicit Database(const std::string& dbPath);
        ~Database();

        sqlite3* get() const;

        void ensureSchema();
        void exec(const std::string& sql);

    private:
        sqlite3* dbConn;
};