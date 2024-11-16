#include "DatabaseHandler.h"
#include <sqlite3.h>
#include <iostream>
#include "./lib/json.hpp"
int main()
{
    // Read the data in
    std::string text;
    std::getline(std::cin, text); // This will be stringified JSON

    nlohmann::json jsonData = nlohmann::json::parse(text); // Get the text back into JSON
    std::string corpusName { jsonData["corpus_name"] };
    int projectId { jsonData["project_id"] };
    
    sqlite3* db;
    
    int exit_code = sqlite3_open("./database/corpus.sqlite", &db);
    if (exit_code) {
        std::cerr << "Error opening database: " << sqlite3_errmsg(db) << std::endl;
        return exit_code;
    }
    
    DatabaseHandler handler(db);
    handler.createCorpusName(projectId, corpusName);
    sqlite3_close(db);
    
    return 0;
}