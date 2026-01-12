#pragma once

#include "../db/Database.h"
#include "../domain/CorpusMetadata.h"
#include <vector>
#include <string>

class ManageProjectRepo {
    public:
        explicit ManageProjectRepo(Database& db);

        CorpusMetadata::ProjectTitle startNewProject(const std::string& project_title);
        CorpusMetadata::ProjectTitle updateProjectTitle(int project_id, const std::string& project_title);
        std::vector<CorpusMetadata::ProjectTitle> getProjectTitles();
        CorpusMetadata::CorpusMetadata getProjectMetadata(int project_id);
    
    private:
        Database& dbConn;
};