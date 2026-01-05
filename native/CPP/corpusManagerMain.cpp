#include "DatabaseHandler.h"
#include <sqlite3.h>
#include <iostream>
#include "./lib/json.hpp"
#include <string>
#include <cstdlib>
#include <sys/stat.h>

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

void handleError(const std::string& message, sqlite3* db = nullptr)
{
    std::cerr << "Error: " << message << std::endl;
    if (db) {
        sqlite3_close(db);
    }
    exit(EXIT_FAILURE);
}

int main(int argc, char* argv[])
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

    // Get database and open it
    const std::string dbPath = getDbPath(argc, argv);
    // Fail fast if missing in order to prevent silently creating a new empty DB somewhere
    if (!fileExists(dbPath)) {
        handleError("Database file does not exist at: " + dbPath);
    }

    sqlite3* db = nullptr;

    int exit_code = sqlite3_open_v2(
        dbPath.c_str(),
        &db,
        SQLITE_OPEN_READWRITE,
        nullptr
    );

    if (exit_code != SQLITE_OK) {
        handleError(std::string("sqlite open failed: ")
            + (db ? sqlite3_errmsg(db): "unknown")
            + " | path: " + dbPath,
            db);
    }

    DatabaseHandler handler(db);

    try {
        if (command == "startNewProject") {
            std::string project_title = inputData["project_name"];
            handler.startNewProject(project_title);
            std::cout << "Project successfully created!" << std::endl;

        } else if (command == "updateProjectTitle") {
            std::string project_title = inputData["project_name"];
            int project_id = inputData["id"];
            nlohmann::json result = handler.updateProjectTitle(project_id, project_title);
            std::cout << result.dump() << std::endl;

        } else if (command == "getProjectTitles") {
            nlohmann::json result = handler.getProjectTitles();
            std::cout << result.dump() << std::endl;

        } else if (command == "patchCorpusName") {
            std::string corpus_name { inputData["corpus_name"] };
            int corpus_id { inputData["id"] };
            nlohmann::json result = handler.updateCorpusName(corpus_id, corpus_name);
            std::cout << result.dump() << std::endl;

        } else if (command == "postCorpusName") {
            std::string corpus_name { inputData["corpus_name"] };
            int project_id { inputData["project_id"] };
            nlohmann::json result = handler.createCorpusName(project_id, corpus_name);
            std::cout << result.dump() << std::endl;

        } else if (command == "getProjectMetadata") {
            int project_id { inputData["id"] };
            nlohmann::json result = handler.getProjectMetadata(project_id);
            std::cout << result.dump() << std::endl;

        } else if (command == "createCorpusGroup") {
            std::string group_name { inputData["groupName"] };
            int corpus_id { inputData["corpus_id"] };
            nlohmann::json result = handler.createCorpusGroup(corpus_id, group_name);
            std::cout << result.dump() << std::endl;

        } else if (command == "uploadFileContent") {
            int group_id { inputData["group_id"] };
            std::string file_content { inputData["file_content"] };
            std::string file_name { inputData["file_name"] };
            nlohmann::json result = handler.uploadFileContent(group_id, file_content, file_name);
            std::cout << result.dump() << std::endl;

        } else if (command == "patchCorpusGroup") {
            int group_id { inputData["id"] };
            std::string group_name { inputData["group_name"] };
            nlohmann::json result = handler.updateCorpusGroupName(group_id, group_name);
            std::cout << result.dump() << std::endl;

        } else if (command == "deleteAFile") {
            int file_id { inputData["id"] };
            handler.deleteAFile(file_id);
            
        } else if (command == "deleteSubcorpus") {
            int group_id { inputData["id"] };
            handler.deleteSubcorpus(group_id);

        } else if (command == "getFileText") {
            int file_id { inputData["id"] };
            nlohmann::json result = handler.getFileText(file_id);
            std::cout << result.dump() << std::endl;
        } else {
            handleError("Unknown command: " + command, db);
        }
    } catch (const std::exception& e) {
        handleError(e.what(), db);
    }

    sqlite3_close(db);
    return 0;
}