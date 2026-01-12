#include "ManageCorpusService.h"

ManageCorpusService::ManageCorpusService(
    ManageProjectRepo& p,
    ManageCorpusRepo& c,
    ManageSubcorpusRepo& s,
    ManageFilesRepo& f
) : projects_(p), corpora_(c), subcorpora_(s), files_(f) {}

// Project
CorpusMetadata::ProjectTitle ManageCorpusService::startNewProject(const std::string& title)
{
    return projects_.startNewProject(title);
}

CorpusMetadata::ProjectTitle ManageCorpusService::updateProjectTitle(int id, const std::string& title)
{
    return projects_.updateProjectTitle(id, title);
}

std::vector<CorpusMetadata::ProjectTitle> ManageCorpusService::getProjectTitles()
{
    return projects_.getProjectTitles();
}

CorpusMetadata::CorpusMetadata ManageCorpusService::getProjectMetadata(int project_id)
{
    return projects_.getProjectMetadata(project_id);
}

// Corpus
CorpusMetadata::Corpus ManageCorpusService::createCorpusName(int project_id, const std::string& name)
{
    return corpora_.createCorpusName(project_id, name);
}

CorpusMetadata::Corpus ManageCorpusService::updateCorpusName(int corpus_id, const std::string& name)
{
    return corpora_.updateCorpusName(corpus_id, name);
}

// Group
CorpusMetadata::SubCorpus ManageCorpusService::createCorpusGroup(int corpus_id, const std::string& name)
{
    return subcorpora_.createCorpusGroup(corpus_id, name);
}

CorpusMetadata::SubCorpus ManageCorpusService::updateCorpusGroupName(int group_id, const std::string& name)
{
    return subcorpora_.updateCorpusGroupName(group_id, name);
}

CorpusMetadata::DeleteSubCorpusResult ManageCorpusService::deleteSubcorpus(int group_id)
{
    return subcorpora_.deleteSubcorpus(group_id);
}

// Files
CorpusMetadata::CorpusFile ManageCorpusService::uploadFileContent(int group_id, const std::string& content, const std::string& name)
{
    return files_.uploadFileContent(group_id, content, name);
}

CorpusMetadata::DeleteFileResult ManageCorpusService::deleteAFile(int file_id)
{
    return files_.deleteAFile(file_id);
}

CorpusMetadata::CorpusFileText ManageCorpusService::getFileText(int file_id)
{
    return files_.getFileText(file_id);
}