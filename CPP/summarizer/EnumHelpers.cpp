#include "EnumHelpers.h"
#include "SummarizerMetadata.h"

namespace SummarizerMetadata {
    AnalysisType parseAnalysisType(const char* str)
    {
        if (!str) return AnalysisType::Unknown;
        std::string val(str);
        if (val == "countWords") return AnalysisType::CountWords;
        if (val == "countCollocations") return AnalysisType::CountCollocations;
        if (val == "countThreeBundles") return AnalysisType::CountThreeBundles;
        if (val == "countFourBundles") return AnalysisType::CountFourBundles;
        return AnalysisType::Unknown;
    }

    std::string analysisTypeToString(AnalysisType type)
    {
        switch(type) {
            case AnalysisType::CountWords: return "countWords";
            case AnalysisType::CountCollocations: return "countCollocations";
            case AnalysisType::CountThreeBundles: return "countThreeBundles";
            case AnalysisType::CountFourBundles: return "countFourBundles";
            default: return "";
        }
    }
}