#pragma once

#include "../db/Database.h"
#include "../domain/CorpusMetadata.h"
#include <vector>
#include <string>

class ManageCorpusRepo {
    public:
        explicit ManageCorpusRepo(Database& db);

        CorpusMetadata::Corpus createCorpusName(int project_id, const std::string& corpus_name);
        CorpusMetadata::Corpus updateCorpusName(int corpus_id, const std::string& corpus_name);

    private:
        Database& dbConn;
};