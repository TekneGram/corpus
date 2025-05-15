#include "./summarizer/DatabaseSummarizer.h"
#include <sqlite3.h>
#include <iostream>
#include "./lib/json.hpp"

void handleError(const std::string& message, sqlite3* db = nullptr)
{
    std::cerr << "Error: " << message << std::endl;
    if (db) {
        sqlite3_close(db);
    }
    exit(EXIT_FAILURE);
}

int main()
{
    std::string text;
    std::getline(std::cin, text);

    // Parse the JSON input
    nlohmann::json inputData;
    try {
        inputData = nlohmann::json::parse(text);
    } catch (const nlohmann::json::parse_error& e) {
        handleError("Invalid JSON input");
    }

    // Extract the command
    std::string command = inputData["command"];
    sqlite3* db;

    // Open the database
    int exit_code = sqlite3_open(("./database/corpus.sqlite"), &db);
    if (exit_code) {
        handleError(sqlite3_errmsg(db), db);
    }
    DatabaseSummarizer summarizer(db);

    try {
        if (command == "summarizeCorpusWords") {
            int corpus_id = inputData["corpusId"];
            summarizer.summarizeCorpusWords(corpus_id);
            std::cout << "Corpus words summarized successfully!" << std::endl;
        }

        if (command == "checkCorpusFilesExist") {
            int corpus_id = inputData["corpusId"];
            summarizer.checkCorpusFilesExist(corpus_id);
            std::cout << "Corpus files checked successfully!" << std::endl;
        }
        
    } catch (const std::exception& e) {
        handleError(e.what(), db);
    }

    sqlite3_close(db);
    return 0;
}