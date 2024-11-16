#include "DatabaseHandler.h"
#include <sqlite3.h>
#include <iostream>
#include "./lib/json.hpp"

int main()
{
    std::string text;
    std::getline(std::cin, text);
    nlohmann::json jsonData = nlohmann::json::parse(text);

    std::string project_title { jsonData["projectTitle"] };

    sqlite3* db;
    int exit_code = sqlite3_open("./database/corpus.sqlite", &db);

    if (exit_code) {
        std::cerr << "Error opening database: " << sqlite3_errmsg(db) << std::endl;
        return exit_code;
    }

    DatabaseHandler handler(db);
    handler.startNewProject(project_title);
    std::cout << "Project successfully started" << std::endl;
    sqlite3_close(db);
    return 0;
}