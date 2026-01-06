#ifndef ENUM_HELPER_H
#define ENUM_HELPER_H

#include <string>
#include "SummarizerMetadata.h"

namespace SummarizerMetadata {
    AnalysisType parseAnalysisType(const char* str);
    std::string analysisTypeToString(AnalysisType type);
}

#endif