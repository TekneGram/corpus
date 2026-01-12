#include "SummarizerService.h"

SummarizerService::SummarizerService(
    SummarizerCorpusStateRepo& s,
    SummarizerWordsRepo& w
) : corpusState_(s), words_(w) {}

// Corpus State
SummarizerMetadata::HasFiles SummarizerService::checkCorpusFilesExist(int corpus_id)
{
    return corpusState_.checkCorpusFilesExist(corpus_id);
}

SummarizerMetadata::CorpusPreppedStatus SummarizerService::checkCorpusPreppedStatus(int corpus_id, std::string& analysis_type)
{
    return corpusState_.checkCorpusPreppedStatus(corpus_id, analysis_type);
}

SummarizerMetadata::CorpusPreppedStatus SummarizerService::updateCorpusPreppedStatus (int corpus_id, std::string& analysis_type, bool to_be_updated)
{
    return corpusState_.updateCorpusPreppedStatus(corpus_id, analysis_type, to_be_updated);
}

SummarizerMetadata::CorpusPreppedStatus SummarizerService::insertCorpusPreppedStatus(int corpus_id, std::string& analysis_type)
{
    return corpusState_.insertCorpusPreppedStatus(corpus_id, analysis_type);
}

// Word counts and lists
void SummarizerService::aggregateCorpusWords(int corpus_id)
{
    return words_.aggregateCorpusWords(corpus_id);
}

void SummarizerService::reAggregateCorpusWords(int corpus_id)
{
    return words_.reAggregateCorpusWords(corpus_id);
}

SummarizerMetadata::WordCounts SummarizerService::fetchWordCounts(int corpus_id)
{
    return words_.fetchWordCounts(corpus_id);
}

SummarizerMetadata::WordLists SummarizerService::fetchWordLists(int corpus_id)
{
    return words_.fetchWordLists(corpus_id);
}