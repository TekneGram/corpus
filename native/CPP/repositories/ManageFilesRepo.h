#pragma once

#include "../db/Database.h"
#include "../domain/CorpusMetadata.h"
#include <vector>
#include <string>

class ManageFilesRepo {
    public:
        explicit ManageFilesRepo(Database& db);

        CorpusMetadata::CorpusFile uploadFileContent(
            int group_id,
            const std::string& file_content,
            const std::string& file_name
        );

        CorpusMetadata::DeleteFileResult deleteAFile(int file_id);
        CorpusMetadata::CorpusFileText getFileText(int file_id);
    
    private:
        Database& dbConn;
        void batchInsert(
            int group_id,
            const std::vector<std::string>& data,
            int file_id,
            const std::string& table,
            const std::string& column
        );

        void insertFileText(
            int group_id,
            int file_id,
            const std::string& text
        );
};