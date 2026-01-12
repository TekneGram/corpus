#pragma once

#include "../repositories/SummarizerCorpusStateRepo.h"
#include "../repositories/SummarizerWordsRepo.h"

class SummarizerService {
    public:
        SummarizerService(
            SummarizerCorpusStateRepo& corpusState,
            SummarizerWordsRepo& words
        );

        // Corpus State
        SummarizerMetadata::HasFiles checkCorpusFilesExist(int corpus_id);
        SummarizerMetadata::CorpusPreppedStatus checkCorpusPreppedStatus(int corpus_id, std::string& analysis_type);
        SummarizerMetadata::CorpusPreppedStatus updateCorpusPreppedStatus (int corpus_id, std::string& analysis_type, bool to_be_updated);
        SummarizerMetadata::CorpusPreppedStatus insertCorpusPreppedStatus(int corpus_id, std::string& analysis_type);

        // Word counts and lists
        void aggregateCorpusWords(int corpus_id);
        void reAggregateCorpusWords(int corpus_id);
        SummarizerMetadata::WordCounts fetchWordCounts(int corpus_id);
        SummarizerMetadata::WordLists fetchWordLists(int corpus_id);

    private:
        SummarizerCorpusStateRepo& corpusState_;
        SummarizerWordsRepo& words_;

};