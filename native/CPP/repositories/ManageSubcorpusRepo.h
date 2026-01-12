#pragma once

#include "../db/Database.h"
#include "../domain/CorpusMetadata.h"
#include <vector>
#include <string>

class ManageSubcorpusRepo {
    public:
        explicit ManageSubcorpusRepo(Database& db);
        CorpusMetadata::SubCorpus createCorpusGroup(int corpus_id, const std::string& group_name);
        CorpusMetadata::SubCorpus updateCorpusGroupName(int group_id, const std::string& group_name);
        CorpusMetadata::DeleteSubCorpusResult deleteSubcorpus(int group_id);

    private:
        Database& dbConn;

};