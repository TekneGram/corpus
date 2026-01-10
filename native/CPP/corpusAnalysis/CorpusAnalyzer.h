#pragma once
#include <string>
#include <vector>

class CorpusAnalyzer
{
    public:
        CorpusAnalyzer(); // constructor
        void parseText(const std::string& text, 
                        std::vector<std::string>& wordlist, 
                        std::vector<std::string>& collList,
                        std::vector<std::string>& threeBundleList,
                        std::vector<std::string>& fourBundleList);
};