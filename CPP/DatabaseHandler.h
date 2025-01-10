#pragma once
#include <sqlite3.h>
#include <string>
#include "./lib/json.hpp"
#include "CorpusMetadata.h"

class DatabaseHandler
{
    public:
        DatabaseHandler(sqlite3* db); // constructor

        void startNewProject(const std::string& project_title);
        nlohmann::json getProjectTitles();
        void createCorpusName(const int& project_id, const std::string& corpus_name);
        void updateCorpusName(const int& corpus_id, const std::string& corpus_name);
        nlohmann::json getProjectMetadata(const int& project_id);
        nlohmann::json createCorpusGroup(const int& corpus_id, const std::string& group_name);
        CorpusMetadata::CorpusFile uploadFileContent(const int& group_id, const std::string& file_content, const std::string& file_name);
        CorpusMetadata::SubCorpus updateCorpusGroupName(const int& group_id, const std::string& group_name);
        void deleteAFile(const int& file_id);
        void deleteSubcorpus(const int& group_id);
    
    private:
        sqlite3* dbConn;
        void batchInsert(const int& group_id, std::vector<std::string> data, const int& file_id, const std::string& table_name, const std::string& col_name);
};