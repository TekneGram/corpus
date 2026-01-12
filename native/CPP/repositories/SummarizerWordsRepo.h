#pragma once

#include "../db/Database.h"
#include "../domain/SummarizerMetadata.h"
#include <vector>
#include <string>

class SummarizerWordsRepo {
    public:
        explicit SummarizerWordsRepo(Database& db);

        void aggregateCorpusWords(int corpus_id);
        void reAggregateCorpusWords(int corpus_id);
        SummarizerMetadata::WordCounts fetchWordCounts(int corpus_id);
        SummarizerMetadata::WordLists fetchWordLists(int corpus_id);

    private:
        Database& dbConn;
};