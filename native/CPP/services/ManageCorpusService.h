#pragma once

#include "../repositories/ManageCorpusRepo.h"
#include "../repositories/ManageFilesRepo.h"
#include "../repositories/ManageProjectRepo.h"
#include "../repositories/ManageSubcorpusRepo.h"

class ManageCorpusService {
    public:
        ManageCorpusService(
            ManageProjectRepo& projects,
            ManageCorpusRepo& corpora,
            ManageSubcorpusRepo& subcorpora,
            ManageFilesRepo& files
        );
        
        // Project
        CorpusMetadata::ProjectTitle startNewProject(const std::string& title);
        CorpusMetadata::ProjectTitle updateProjectTitle(int id, const std::string& title);
        std::vector<CorpusMetadata::ProjectTitle> getProjectTitles();
        CorpusMetadata::CorpusMetadata getProjectMetadata(int project_id);

        // Corpus
        CorpusMetadata::Corpus createCorpusName(int project_id, const std::string& name);
        CorpusMetadata::Corpus updateCorpusName(int corpus_id, const std::string& name);

        // Group
        CorpusMetadata::SubCorpus createCorpusGroup(int corpus_id, const std::string& name);
        CorpusMetadata::SubCorpus updateCorpusGroupName(int group_id, const std::string& name);
        CorpusMetadata::DeleteSubCorpusResult deleteSubcorpus(int group_id);

        // Files
        CorpusMetadata::CorpusFile uploadFileContent(int group_id,
            const std::string& content,
            const std::string& name);

        CorpusMetadata::DeleteFileResult deleteAFile(int file_id);
        CorpusMetadata::CorpusFileText getFileText(int file_id);

    private:
        ManageProjectRepo& projects_;
        ManageCorpusRepo& corpora_;
        ManageSubcorpusRepo& subcorpora_;
        ManageFilesRepo& files_;
};