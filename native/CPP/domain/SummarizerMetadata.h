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

    /**
     * Word Counts
     */

    // Word counts in the corpus
    struct WordCountsPerCorpus {
        int corpus_id;
        int type_count;
        int token_count;
    };

    // Word counts in the group
    struct GroupWordCounts {
        int group_id;
        std::string group_name;
        int type_count;
        int token_count;
    };

    struct WordCountsPerGroup {
        int corpus_id;
        std::vector<GroupWordCounts> group_word_counts;
    };

    // Word counts in the individual files
    struct FileWordCounts {
        int file_id;
        int group_id;
        std::string file_name;
        int type_count;
        int token_count;
    };

    struct WordCountsPerFile {
        int corpus_id;
        std::vector<FileWordCounts> file_word_counts;
    };

    // All fetched data
    struct WordCounts {
        WordCountsPerCorpus word_counts_per_corpus;
        WordCountsPerGroup word_counts_per_group;
        WordCountsPerFile word_counts_per_file;
    };

    /**
     * Word Lists
     */

     // Word list for the whole corpus
     struct WordDataCorpus {
        int id;
        std::string word;
        int count;
     };

     struct WordListPerCorpus {
        int corpus_id;
        std::vector<WordDataCorpus> word;
     };

     // Word lists per group
     struct WordDataGroup {
        int id;
        int group_id;
        std::string word;
        int count;
     };

     struct WordListPerGroup {
        int corpus_id;
        std::vector<WordDataGroup> word;
     };

     // Word lists per file
     struct WordDataFile {
        int id;
        int group_id;
        int file_id;
        std::string word;
        int count;
     };

     struct WordListPerFile {
        int corpus_id;
        std::vector<WordDataFile> word;
     };

     // All word list data
     struct WordLists {
        WordListPerCorpus word_list_per_corpus;
        WordListPerGroup word_list_per_group;
        WordListPerFile word_list_per_file;
     };

    /**
     * JSON conversion function declarations:
     */

    void to_json(nlohmann::json& j, const HasFiles& hasFiles);
    void to_json(nlohmann::json& j, const CorpusPreppedStatus& corpusPreppedStatus);
    
    // Word counts
    void to_json(nlohmann::json& j, const WordCountsPerCorpus& wordCountsPerCorpus);
    
    void to_json(nlohmann::json& j, const GroupWordCounts& groupWordCounts);
    void to_json(nlohmann::json& j, const WordCountsPerGroup& wordCountsPerGroup);

    void to_json(nlohmann::json& j, const FileWordCounts& fileWordCounts);
    void to_json(nlohmann::json& j, const WordCountsPerFile& wordCountsPerFile);

    void to_json(nlohmann::json& j, const WordCounts& wordCounts);

    // Word lists
    void to_json(nlohmann::json& j, const WordDataCorpus& wordDataCorpus);
    void to_json(nlohmann::json& j, const WordListPerCorpus& wordListPerCorpus);

    void to_json(nlohmann::json& j, const WordDataGroup& wordDataGroup);
    void to_json(nlohmann::json& j, const WordListPerGroup& wordListPerGroup);

    void to_json(nlohmann::json& j, const WordDataFile& wordDataFile);
    void to_json(nlohmann::json& j, const WordListPerFile& wordListPerFile);

    void to_json(nlohmann::json& j, const WordLists& wordLists);


} // namespace SummarizeMatadata

#endif // SUMMARIZER_METADATA_H