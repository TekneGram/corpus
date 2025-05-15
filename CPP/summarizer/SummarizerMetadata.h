#ifndef SUMMARIZER_METADATA_H
#define SUMMARIZER_METADATA_H

#include <string>
#include <vector>
#include "../lib/json.hpp"

namespace SummarizerMetadata {

    struct HasFiles {
        int corpus_id;
        bool has_files;
    };

    // JSON conversion function
    void to_json(nlohmann::json& j, const HasFiles& hasFiles);

} // namespace SummarizeMatadata

#endif // SUMMARIZER_METADATA_H