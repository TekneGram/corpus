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
        j = nlohmann::json{
            {"corpusId", wordCountsPerCorpus.corpus_id}, 
            {"tokenCount", wordCountsPerCorpus.token_count},
            {"typeCount", wordCountsPerCorpus.type_count}
        };
    }

    void to_json(nlohmann::json& j, const GroupWordCounts& groupWordCounts)
    {
        j = nlohmann::json{
            {"groupId", groupWordCounts.group_id},
            {"groupName", groupWordCounts.group_name}, 
            {"tokenCount", groupWordCounts.token_count}, 
            {"typeCount", groupWordCounts.type_count}
        };
    }

    void to_json(nlohmann::json& j, const WordCountsPerGroup& wordCountsPerGroup)
    {
        j = nlohmann::json{
            {"corpusId", wordCountsPerGroup.corpus_id},
            {"groupWordCounts", wordCountsPerGroup.group_word_counts}
        };
    }

    void to_json(nlohmann::json& j, const FileWordCounts& fileWordCounts)
    {
        j = nlohmann::json{
            {"fileId", fileWordCounts.file_id}, 
            {"groupId", fileWordCounts.group_id}, 
            {"fileName", fileWordCounts.file_name},
            {"typeCount", fileWordCounts.type_count}, 
            {"tokenCount", fileWordCounts.token_count}
        };
    }


    void to_json(nlohmann::json& j, const WordCountsPerFile& wordCountsPerFile)
    {
        j = nlohmann::json{
            {"corpusId", wordCountsPerFile.corpus_id},
            {"fileWordCounts", wordCountsPerFile.file_word_counts}};
    }


    void to_json(nlohmann::json& j, const WordCounts& wordCounts)
    {
        j = nlohmann::json{
            {"wordCountsPerCorpus", wordCounts.word_counts_per_corpus}, 
            {"wordCountsPerGroup", wordCounts.word_counts_per_group}, 
            {"wordCountsPerFile", wordCounts.word_counts_per_file}
        };
    }

    void to_json(nlohmann::json& j, const WordDataCorpus& wordDataCorpus)
    {
        j = nlohmann::json{
            {"id", wordDataCorpus.id},
            {"word", wordDataCorpus.word},
            {"count", wordDataCorpus.count}
        };
    }

    void to_json(nlohmann::json& j, const WordListPerCorpus& wordListPerCorpus)
    {
        j = nlohmann::json{
            {"corpusId", wordListPerCorpus.corpus_id},
            {"word", wordListPerCorpus.word}
        };
    }

    void to_json(nlohmann::json& j, const WordDataGroup& wordDataGroup)
    {
        j = nlohmann::json{
            {"id", wordDataGroup.id},
            {"groupId", wordDataGroup.group_id},
            {"word", wordDataGroup.word},
            {"count", wordDataGroup.count}
        };
    }

    void to_json(nlohmann::json& j, const WordListPerGroup& wordListPerGroup)
    {
        j = nlohmann::json{
            {"corpusId", wordListPerGroup.corpus_id},
            {"word", wordListPerGroup.word}
        };
    }

    void to_json(nlohmann::json& j, const WordDataFile& wordDataFile)
    {
        j = nlohmann::json{
            {"id", wordDataFile.id},
            {"groupId", wordDataFile.group_id},
            {"fileId", wordDataFile.file_id},
            {"word", wordDataFile.word},
            {"count", wordDataFile.count}
        };
    }

    void to_json(nlohmann::json& j, const WordListPerFile& wordListPerFile)
    {
        j = nlohmann::json{
            {"corpusId", wordListPerFile.corpus_id},
            {"word", wordListPerFile.word}
        };
    }

    void to_json(nlohmann::json& j, const WordLists& wordLists)
    {
        j = nlohmann::json{
            {"wordListPerCorpus", wordLists.word_list_per_corpus},
            {"wordListPerGroup", wordLists.word_list_per_group},
            {"wordListPerFile", wordLists.word_list_per_file}
        };
    }

}