// For object lifetime and ownership

#include "DatabaseHandler.h"
#include <stdexcept>

DatabaseHandler::DatabaseHandler(sqlite3* db) : dbConn(db)
{
    if (!dbConn){
        throw std::runtime_error("DatabaseHandler received a null db");
    }
}

DatabaseHandler::~DatabaseHandler()
{
    // does not own sqlite3*, so no sqlite_close here
}