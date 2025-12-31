#pragma once
#include <sqlite3.h>
#include <string>
#include "../lib/json.hpp"
#include "WordStatsMetadata.h"

class WordStats
{
    public:
        WordStats(sqlite3* db); // constructor

    private:
        sqlite3* dbConn;
}