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

    // JSON conversion function
    void to_json(nlohmann::json& j, const HasFiles& hasFiles);
    void to_json(nlohmann::json& j, const CorpusPreppedStatus& corpusPreppedStatus);

} // namespace SummarizeMatadata

#endif // SUMMARIZER_METADATA_H