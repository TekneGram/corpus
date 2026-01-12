#include "SummarizerCorpusStateRepo.h"
#include "../db/StmtGuard.h";
#include "../db/TransactionGuard.h"

#include <stdexcept>
#include <map>

SummarizerCorpusStateRepo::SummarizerCorpusStateRepo(Database& db) : dbConn(db) {}

SummarizerMetadata::HasFiles checkCorpusFilesExist(int corpus_id)
{

}

SummarizerMetadata::CorpusPreppedStatus checkCorpusPreppedStatus(int corpus_id, std::string& analysis_type)
{

}

SummarizerMetadata::CorpusPreppedStatus updateCorpusPreppedStatus (int corpus_id, std::string& analysis_type, bool to_be_updated)
{

}

SummarizerMetadata::CorpusPreppedStatus insertCorpusPreppedStatus(int corpus_id, std::string& analysis_type)
{

}