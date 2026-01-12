#include "./db/Database.h"
#include <iostream>
#include "./lib/json.hpp"
#include <string>
#include <cstdlib>
#include <sys/stat.h>
#include "repositories/SummarizerCorpusStateRepo.h"
#include "repositories/SummarizerWordsRepo.h"
#include "services/SummarizerService.h"

#ifdef _WIN32
    #include <io.h>
    #define access _access
    #define F_OK 0
#else
    #include <unistd.h>
#endif

static bool fileExists(const std::string& path) {
    return access(path.c_str(), F_OK) == 0;
}

// -------------
// Database path resolution
// -------------
static std::string getDbPath(int argc, char* argv[]) {
    // 1) CLI: --db <path>
    for (int i = 1; i < argc - 1; ++i) {
        if (std::string(argv[i]) == "--db") {
            return std::string(argv[i+1]);
        }
    }

    // 2) ENV: CORPUS_DB_PATH
    const char* env = std::getenv("CORPUS_DB_PATH");
    if (env && env[0] != '\0') {
        return std::string(env);
    }

    // 3) Fallback keeps current behaviour
    return "./database/corpus.sqlite";
}

// -------------
// Error handling
// -------------
[[noreturn]] static void fatal(const std::string& msg) {
    std::cerr << "Fatal error: " << msg << std::endl;
    std::exit(EXIT_FAILURE);
}

int main(int argc, char* argv[])
{
    // Read input
    std::string text(
        (std::istreambuf_iterator<char>(std::cin)),
        std::istreambuf_iterator<char>()
    );

    if (text.empty()) {
        fatal("Empty input received");
    }

    // Parse the JSON input
    nlohmann::json inputData;
    try {
        inputData = nlohmann::json::parse(text);
    } catch (const nlohmann::json::parse_error& e) {
        fatal("Invalid JSON input");
    }

    // Extract the command
    if (!inputData.contains("command") || !inputData["command"].is_string()) {
        fatal("Missing or invalid command to run C++");
    }
    std::string command = inputData["command"].get<std::string>();

    // Resolve the database path
    const std::string dbPath = getDbPath(argc, argv);

    Database db(dbPath);
    db.ensureSchema();

    // Create dependencies
    SummarizerCorpusStateRepo corpusState(db);
    SummarizerWordsRepo words(db);

    SummarizerService service(corpusState, words);

    try {

        if (command == "checkCorpusFilesExist") {
            int corpus_id = inputData["corpusId"];
            nlohmann::json result = service.checkCorpusFilesExist(corpus_id);
            std::cout << result.dump() << std::endl;
        }

        if (command == "checkCorpusPreppedStatus") {
            try {
                int corpus_id = inputData["corpusId"];
                std::string analysis_type = inputData["analysisType"];
                nlohmann::json result = service.checkCorpusPreppedStatus(corpus_id, analysis_type);
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
            nlohmann::json result = service.updateCorpusPreppedStatus(corpus_id, analysis_type, to_be_updated);
            std::cout << result.dump() << std::endl;
        }

        if (command == "insertCorpusPreppedStatus") {
            int corpus_id = inputData["corpusId"];
            std::string analysis_type = inputData["analysisType"];
            nlohmann::json result = service.insertCorpusPreppedStatus(corpus_id, analysis_type);
            std::cout << result.dump() << std::endl;
        }

        if (command == "summarizeCorpusWords") {
            int corpus_id = inputData["corpusId"];
            service.aggregateCorpusWords(corpus_id);
        }

        if (command == "recountCorpusWords") {
            int corpus_id = inputData["corpusId"];
            service.reAggregateCorpusWords(corpus_id);
        }

        if (command == "fetchWordCounts") {
            int corpus_id = inputData["corpusId"];
            nlohmann::json result = service.fetchWordCounts(corpus_id);
            std::cout << result.dump() << std::endl;
        }

        if (command == "fetchWordLists") {
            int corpus_id = inputData["corpusId"];
            nlohmann::json result = service.fetchWordLists(corpus_id);
            std::cout << result.dump() << std::endl;
        }
        
    } catch (const std::exception& e) {
        fatal(e.what());
    }
    return 0;
}