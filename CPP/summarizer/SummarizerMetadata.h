#ifndef SUMMARIZER_METADATA_H
#define SUMMARIZER_METADATA_H

#include <string>
#include <vector>
#include "../lib/json.hpp"

namespace SummarizerMetadata {

    enum class AnalysisType {
        Unknown,
        CountWords,
        CountCollocations,
        CountThreeBundles,
        CountFourBundles
    };

    struct HasFiles {
        int corpus_id;
        bool has_files;
    };

    struct CorpusPreppedStatus {
        int corpus_id;
        AnalysisType analysis_type;
        int up_to_date; // -1 = null, 0 = false, 1 = true
    };

    struct WordCountsPerCorpus {
        int corpus_id;
        int type_count;
        int token_count;
    };

    struct GroupWordCounts {
        int group_id;
        int type_count;
        int token_count;
    };

    struct WordCountsPerGroup {
        int corpus_id;
        std::vector<GroupWordCounts> group_word_counts;
    };

    // JSON conversion function
    void to_json(nlohmann::json& j, const HasFiles& hasFiles);
    void to_json(nlohmann::json& j, const CorpusPreppedStatus& corpusPreppedStatus);
    void to_json(nlohmann::json& j, const WordCountsPerCorpus& wordCountsPerCorpus);
    void to_json(nlohmann::json& j, const GroupWordCounts& groupWordCounts);
    void to_json(nlohmann::json& j, const WordCountsPerGroup& wordCountsPerGroup);

} // namespace SummarizeMatadata

#endif // SUMMARIZER_METADATA_H