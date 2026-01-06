#include "CorpusMetadata.h"

namespace CorpusMetadata {

    void to_json(nlohmann::json& j, const ProjectTitle& projectTitle)
    {
        j = nlohmann::json{{"id", projectTitle.id}, {"project_name", projectTitle.project_name}};
    }

    void to_json(nlohmann::json& j, const Corpus& corpus)
    {
        j = nlohmann::json{{"id", corpus.id}, {"corpus_name", corpus.corpus_name}};
    }

    void to_json(nlohmann::json& j, const CorpusFile& corpusFile)
    {
        j = nlohmann::json{{"id", corpusFile.id}, {"file_name", corpusFile.file_name}};
    }

    void to_json(nlohmann::json& j, const SubCorpus& subCorpus)
    {
        j = nlohmann::json{{"id", subCorpus.id}, {"group_name", subCorpus.group_name}};
    }

    void to_json(nlohmann::json& j, const CorpusFilesPerSubCorpus& corpusFiles)
    {
        j = nlohmann::json{{"subCorpus", corpusFiles.subCorpus}, {"corpusFiles", corpusFiles.corpusFiles}};
    }

    void to_json(nlohmann::json& j, const CorpusMetadata& corpusMetadata)
    {
        j = nlohmann::json{{"projectTitle", corpusMetadata.projectTitle}, {"corpus", corpusMetadata.corpus}, {"files", corpusMetadata.files}};
    }

    void to_json(nlohmann::json& j, const CorpusFileText& corpusFileText)
    {
        j = nlohmann::json{{"id", corpusFileText.file_id}, {"file_text", corpusFileText.file_text}};
    }



}