#pragma once
#include <sqlite3.h>
#include <string>
#include "./lib/json.hpp"
#include "CorpusMetadata.h"

class DatabaseHandler
{
    public:
        DatabaseHandler(sqlite3* db); // constructor

        nlohmann::json getProjectTitles();
        void createCorpusName(const int& project_id, const std::string& corpus_name);
        void updateCorpusName(const int& corpus_id, const std::string& corpus_name);
        nlohmann::json getProjectMetadata(const int& project_id);
    
    private:
        sqlite3* dbConn;
};