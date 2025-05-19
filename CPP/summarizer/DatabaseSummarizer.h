#pragma once
#include <sqlite3.h>
#include <string>
#include "../lib/json.hpp"
#include "../CorpusMetadata.h"
#include "SummarizerMetadata.h"

class DatabaseSummarizer
{
    public:
        DatabaseSummarizer(sqlite3* db); // constructor
        SummarizerMetadata::HasFiles checkCorpusFilesExist(const int& corpus_id);
        SummarizerMetadata::CorpusPreppedStatus checkCorpusPreppedStatus(const int& corpus_id, std::string& analysis_type);
        SummarizerMetadata::CorpusPreppedStatus updateCorpusPreppedStatus (const int& corpus_id, std::string& analysis_type, bool to_be_updated);
        SummarizerMetadata::CorpusPreppedStatus insertCorpusPreppedStatus(const int& corpus_id, std::string& analysis_type);
        void summarizeCorpusWords(const int& corpus_id);
        void recountCorpusWords(const int& corpus_id);
        SummarizerMetadata::WordCounts fetchWordCounts(const int& corpus_id);
        SummarizerMetadata::WordLists fetchWordLists(const int& corpus_id);

    private:
        sqlite3* dbConn;
        void countWordsPerFile(const int& corpus_id);
        void createWordListPerFile(const int& corpus_id);
        void countWordsPerGroup(const int& corpus_id);
        void createWordListPerGroup(const int& corpus_id);
        void countWordsPerCorpus(const int& corpus_id);
        void createWordListPerCorpus(const int& corpus_id);

        void deleteWordsPerFile(const int& corpus_id);
        void deleteWordListPerFile(const int& corpus_id);
        void deleteWordsPerGroup(const int& corpus_id);
        void deleteWordListPerGroup(const int& corpus_id);
        void deleteWordsPerCorpus(const int& corpus_id);
        void deleteWordListPerCorpus(const int& corpus_id);

        SummarizerMetadata::WordCountsPerCorpus fetchWordCountsPerCorpus(const int& corpus_id);
        SummarizerMetadata::WordCountsPerGroup fetchWordCountsPerGroup(const int& corpus_id);
        SummarizerMetadata::WordCountsPerFile fetchWordCountsPerFile(const int& corpus_id);

        SummarizerMetadata::WordListPerCorpus fetchWordListPerCorpus(const int& corpus_id);
        SummarizerMetadata::WordListPerGroup fetchWordListPerGroup(const int& corpus_id);
        SummarizerMetadata::WordListPerFile fetchWordListPerFile(const int& corpus_id);
};