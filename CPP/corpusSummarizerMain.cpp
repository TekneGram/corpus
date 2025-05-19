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

        if (command == "checkCorpusFilesExist") {
            int corpus_id = inputData["corpusId"];
            nlohmann::json result = summarizer.checkCorpusFilesExist(corpus_id);
            std::cout << result.dump() << std::endl;
        }

        if (command == "checkCorpusPreppedStatus") {
            try {
                int corpus_id = inputData["corpusId"];
                std::string analysis_type = inputData["analysisType"];
                nlohmann::json result = summarizer.checkCorpusPreppedStatus(corpus_id, analysis_type);
                try {
                    std::cout << result.dump() << std::endl;
                } catch (const std::exception& e) {
                    std::cerr << "Exception while dumping JSON: " << e.what() << std::endl;
                }
            } catch (const std::exception& e) {
                std::cerr << "Exception caught: " << e.what() << std::endl;
            } catch (...) {
                std::cerr << "Unknown exception caught." << std::endl;
            }
            
        }

        if (command == "updateCorpusPreppedStatus") {
            int corpus_id = inputData["corpusId"];
            std::string analysis_type = inputData["analysisType"];
            bool to_be_updated = inputData["toBeUpdated"];
            nlohmann::json result = summarizer.updateCorpusPreppedStatus(corpus_id, analysis_type, to_be_updated);
            std::cout << result.dump() << std::endl;
        }

        if (command == "insertCorpusPreppedStatus") {
            int corpus_id = inputData["corpusId"];
            std::string analysis_type = inputData["analysisType"];
            nlohmann::json result = summarizer.insertCorpusPreppedStatus(corpus_id, analysis_type);
            std::cout << result.dump() << std::endl;
        }

        if (command == "summarizeCorpusWords") {
            int corpus_id = inputData["corpusId"];
            summarizer.summarizeCorpusWords(corpus_id);
        }

        if (command == "recountCorpusWords") {
            int corpus_id = inputData["corpusId"];
            summarizer.recountCorpusWords(corpus_id);
        }

        if (command == "fetchWordCounts") {
            int corpus_id = inputData["corpusId"];
            nlohmann::json result = summarizer.fetchWordCounts(corpus_id);
            std::cout << result.dump() << std::endl;
        }
        
    } catch (const std::exception& e) {
        handleError(e.what(), db);
    }

    sqlite3_close(db);
    return 0;
}