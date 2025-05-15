#include "SummarizerMetadata.h"

namespace SummarizerMetadata {
    void to_json(nlohmann::json& j, const HasFiles& hasFiles)
    {
        j = nlohmann::json{{"corpus_id", hasFiles.corpus_id}, {"has_files", hasFiles.has_files}};
    }
}