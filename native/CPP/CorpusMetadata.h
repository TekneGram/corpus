// CorpusMetadata.h
#ifndef CORPUS_METADATA_H
#define CORPUS_METADATA_H

#include <string>
#include <vector>
#include "./lib/json.hpp"

namespace CorpusMetadata {
    
    struct ProjectTitle {
        int id;
        std::string project_name;
    };

    struct Corpus {
        int id;
        std::string corpus_name;
    };

    struct CorpusFile {
        int id;
        std::string file_name;
    };

    struct SubCorpus {
        int id;
        std::string group_name;
    };

    struct CorpusFilesPerSubCorpus {
        SubCorpus subCorpus;
        std::vector<CorpusFile> corpusFiles;
    };

    struct CorpusMetadata {
        ProjectTitle projectTitle;
        Corpus corpus;
        std::vector<CorpusFilesPerSubCorpus> files;
    };

    struct CorpusFileText {
        int file_id;
        std::string file_text;
    };

    struct DeleteFileResult {
        bool success;
        bool fileDeleted;
        bool groupDeleted;
        int groupId;
        std::string message;
    };

    // JSON conversion function
    void to_json(nlohmann::json& j, const ProjectTitle& projectTitle);
    void to_json(nlohmann::json& j, const Corpus& corpus);
    void to_json(nlohmann::json& j, const CorpusFile& file);
    void to_json(nlohmann::json& j, const SubCorpus& subCorpus);
    void to_json(nlohmann::json& j, const CorpusFilesPerSubCorpus& filesPerSubCorpus);
    void to_json(nlohmann::json& j, const CorpusMetadata& corpusMetadata);
    void to_json(nlohmann::json& j, const CorpusFileText& corpusFileText);
    void to_json(nlohmann::json& j, const DeleteFileResult& deleteFileResult);

} // namespace CorpusMetaData

#endif // CORPUS_METADATA_H