#include "DatabaseHandler.h"
#include <sqlite3.h>
#include <iostream>
#include "./lib/json.hpp"
int main()
{
    std::string text;
    std::getline(std::cin, text);
    
    nlohmann::json jsonData = nlohmann::json::parse(text);
    int corpus_id { jsonData["id"] };
    std::string corpus_name { jsonData["corpus_name"] };

    sqlite3* db;

    int exit_code = sqlite3_open("./database/corpus.sqlite", &db);
    if (exit_code) {
        std::cerr << "Error opening the database: " << sqlite3_errmsg(db) << std::endl;
        return exit_code;
    }

    DatabaseHandler handler(db);
    handler.updateCorpusName(corpus_id, corpus_name);
    sqlite3_close(db);

    return 0;
}