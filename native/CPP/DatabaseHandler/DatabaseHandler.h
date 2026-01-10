#pragma once

#include <sqlite3.h>
#include <string>
#include <vector>

#include "../lib/json.hpp"
#include "../CorpusMetadata.h"

class DatabaseHandler
{
    public:
        explicit DatabaseHandler(const std::string& dbPath);
        ~DatabaseHandler();

        sqlite3* getDb() const;

        void ensureSchema();

        // ==== Project ====
        CorpusMetadata::ProjectTitle startNewProject(const std::string& project_title);

        CorpusMetadata::ProjectTitle updateProjectTitle(const int& project_id, const std::string& project_title);
        std::vector<CorpusMetadata::ProjectTitle> getProjectTitles();
        CorpusMetadata::CorpusMetadata getProjectMetadata(const int& project_id);

        // ==== Corpus ====
        CorpusMetadata::Corpus createCorpusName(const int& project_id, const std::string& corpus_name);
        CorpusMetadata::Corpus updateCorpusName(const int& corpus_id, const std::string& corpus_name);

        // ==== Subcorpus / Group ====
        CorpusMetadata::SubCorpus createCorpusGroup(const int& corpus_id, const std::string& group_name);
        CorpusMetadata::SubCorpus updateCorpusGroupName(const int& group_id, const std::string& group_name);
        CorpusMetadata::DeleteSubCorpusResult deleteSubcorpus(const int& group_id);

        // ==== Files ====
        CorpusMetadata::CorpusFile uploadFileContent(const int& group_id, const std::string& file_content, const std::string& file_name);
        CorpusMetadata::DeleteFileResult deleteAFile(const int& file_id);
        CorpusMetadata::CorpusFileText getFileText(const int& file_id);

    private:
        sqlite3* dbConn;
        void exec(const std::string& sql);

        // ==== Internal helpers ====
        void batchInsert(const int& group_id, const std::vector<std::string>& data, const int& file_id, const std::string& table_name, const std::string& col_name);
        void insertFileText(const int& group_id, const int& file_id, const std::string& file_content);

};