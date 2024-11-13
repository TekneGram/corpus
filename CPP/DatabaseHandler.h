#pragma once
#include <sqlite3.h>
class DatabaseHandler
{
    public:
        DatabaseHandler(sqlite3* db); // constructor

        void createCorpus();
        void createGroup();
        void insertFile();
        void insertWords();
        void insertColls();
        void insertThreeBuns();
        void insertFourBuns();
    
    private:
        sqlite3* dbConn;
};