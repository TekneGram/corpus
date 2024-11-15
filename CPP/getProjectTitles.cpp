#include "DatabaseHandler.h"
#include <sqlite3.h>
#include <iostream>
#include "./lib/json.hpp"

int main()
{
    sqlite3* db;
    int exit_code = sqlite3_open("./database/corpus.sqlite", &db);

    if (exit_code) {
        std::cerr << "Error opening database: " << sqlite3_errmsg(db) << std::endl;
        return exit_code;
    }

    DatabaseHandler handler(db);
    nlohmann::json result = handler.getProjectTitles();
    std::string stringResult = result.dump();

    std::cout << stringResult << std::endl;
    sqlite3_close(db);
    return 0;
}