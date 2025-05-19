#include "SummarizerMetadata.h"

namespace SummarizerMetadata {
    void to_json(nlohmann::json& j, const HasFiles& hasFiles)
    {
        j = nlohmann::json{{"corpus_id", hasFiles.corpus_id}, {"has_files", hasFiles.has_files}};
    }

    void to_json(nlohmann::json& j, const CorpusPreppedStatus& corpusPreppedStatus)
    {
        std::string analysisStr;
        switch(corpusPreppedStatus.analysis_type) {
            case AnalysisType::CountWords:          analysisStr = "countWords"; break;
            case AnalysisType::CountCollocations:   analysisStr = "countCollocations"; break;
            case AnalysisType::CountThreeBundles:   analysisStr = "countThreeBundles"; break;
            case AnalysisType::CountFourBundles:    analysisStr = "countFourBundles"; break;
            default:                                analysisStr = ""; break;
        }
        j = nlohmann::json{
            {"corpus_id", corpusPreppedStatus.corpus_id}, 
            {"analysis_type", analysisStr.empty() ? nlohmann::json(nullptr) : nlohmann::json(analysisStr)}, 
            {"up_to_date", corpusPreppedStatus.up_to_date == -1 ? nlohmann::json(nullptr) : nlohmann::json(static_cast<bool>(corpusPreppedStatus.up_to_date))}
        };
    }

    void to_json(nlohmann::json& j, const WordCountsPerCorpus& wordCountsPerCorpus)
    {
        j = nlohmann::json{{"corpusId", wordCountsPerCorpus.corpus_id}, {"tokenCount", wordCountsPerCorpus.token_count}, {"typeCount", wordCountsPerCorpus.type_count}};
    }

    void to_json(nlohmann::json& j, const GroupWordCounts& groupWordCounts)
    {
        j = nlohmann::json{{"groupId", groupWordCounts.group_id}, {"tokenCount", groupWordCounts.token_count}, {"typeCount", groupWordCounts.type_count}};
    }

    void to_json(nlohmann::json& j, const WordCountsPerGroup& wordCountsPerGroup)
    {
        j = nlohmann::json{{"corpusId", wordCountsPerGroup.corpus_id}, {"groupWordCounts", wordCountsPerGroup.group_word_counts}};
    }

    void to_json(nlohmann::json& j, const FileWordCounts& fileWordCounts)
    {
        j = nlohmann::json{{"fileId", fileWordCounts.file_id}, {"groupId", fileWordCounts.group_id}, {"typeCount", fileWordCounts.type_count}, {"tokenCount", fileWordCounts.token_count}};
    }


    void to_json(nlohmann::json& j, const WordCountsPerFile& wordCountsPerFile)
    {
        j = nlohmann::json{{"corpusId", wordCountsPerFile.corpus_id}, {"fileGroupWordCounts", wordCountsPerFile.file_word_counts}};
    }


    void to_json(nlohmann::json& j, const WordCounts wordCounts)
    {
        j = nlohmann::json{{"wordCountsPerCorpus", wordCounts.word_counts_per_corpus}, {"wordCountsPerGroup", wordCounts.word_counts_per_group}, {"wordCountsPerFile", wordCounts.word_counts_per_file}};
    }
}