#include "SummarizerWordsRepo.h"
#include "../db/StmtGuard.h";
#include "../db/TransactionGuard.h"

#include <stdexcept>
#include <map>

SummarizerWordsRepo::SummarizerWordsRepo(Database& db) : dbConn(db) {}

void aggregateCorpusWords(int corpus_id)
{

}

void reAggregateCorpusWords(int corpus_id)
{

}

SummarizerMetadata::WordCounts fetchWordCounts(int corpus_id)
{

}

SummarizerMetadata::WordLists fetchWordLists(int corpus_id)
{
    
}