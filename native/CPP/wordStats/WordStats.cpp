#include "WordStats.h"
#include <sqlite3.h>
#include <iostream>
#include "../lib/json.hpp"
#include "WordStatsMetadata.h"

WordStats::WordStats(sqlite3* db)
{
    dbConn = db;
}