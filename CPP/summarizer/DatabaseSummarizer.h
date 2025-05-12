#pragma once
#include <sqlite3.h>
#include <string>
#include "../lib/json.hpp"
#include "../CorpusMetadata.h"

class DatabaseSummarizer
{
    public:
        DatabaseSummarizer(sqlite3* db); // constructor
        void summarizeCorpusWords(const int& corpus_id);

    private:
        sqlite3* dbConn;
        void countWordsPerFile(const int& corpus_id);
        void createWordListPerFile(const int& corpus_id);
        void countWordsPerGroup(const int& corpus_id);
        void createWordListPerGroup(const int& corpus_id);
        void countWordsPerCorpus(const int& corpus_id);
        void createWordListPerCorpus(const int& corpus_id);
};