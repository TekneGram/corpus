#pragma once
#include <sqlite3.h>
#include <string>
class DatabaseHandler
{
    public:
        DatabaseHandler(sqlite3* db); // constructor

        void createCorpusName(const int& project_id, const std::string& corpus_name);
        // void createGroup();
        // void insertFile();
        // void insertWords();
        // void insertColls();
        // void insertThreeBuns();
        // void insertFourBuns();
    
    private:
        sqlite3* dbConn;
};