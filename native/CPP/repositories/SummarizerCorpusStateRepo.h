#pragma once

#include "../db/Database.h"
#include "../domain/SummarizerMetadata.h"
#include <vector>
#include <string>

class SummarizerCorpusStateRepo {
    public:
        explicit SummarizerCorpusStateRepo(Database& db);

        SummarizerMetadata::HasFiles checkCorpusFilesExist(int corpus_id);
        SummarizerMetadata::CorpusPreppedStatus checkCorpusPreppedStatus(int corpus_id, std::string& analysis_type);
        SummarizerMetadata::CorpusPreppedStatus updateCorpusPreppedStatus (int corpus_id, std::string& analysis_type, bool to_be_updated);
        SummarizerMetadata::CorpusPreppedStatus insertCorpusPreppedStatus(int corpus_id, std::string& analysis_type);

    private:
        Database& dbConn;
};