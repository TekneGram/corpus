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
}