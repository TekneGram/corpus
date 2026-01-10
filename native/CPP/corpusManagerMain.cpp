#include "./DatabaseHandler/DatabaseHandler.h"
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
    std::string text(
        (std::istreambuf_iterator<char>(std::cin)),
        std::istreambuf_iterator<char>()
    );

    if (text.empty()) {
        handleError("Empty input received");
    }

    // Parse the JSON input
    nlohmann::json inputData;
    try {
        inputData = nlohmann::json::parse(text);
    } catch (const nlohmann::json::parse_error& e) {
        handleError("Invalid JSON input");
    }

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

    // Extract the command
    if (!inputData.contains("command") || !inputData["command"].is_string()) {
        handleError("Missing or invalid command to run C++", db);
    }
    std::string command = inputData["command"].get<std::string>();

    try {
        if (command == "startNewProject") {
            if (!inputData.contains("project_name") || !inputData["project_name"].is_string()) {
                throw std::runtime_error("Missing or invalid project_name");
            }
            std::string project_title = inputData["project_name"].get<std::string>();
            nlohmann::json result = handler.startNewProject(project_title);
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else if (command == "updateProjectTitle") {
            if (!inputData.contains("project_name") || !inputData["project_name"].is_string()) {
                throw std::runtime_error("Missing or invalid project_name");
            }
            if (!inputData.contains("id") || !inputData["id"].is_number_integer()) {
                throw std::runtime_error("Missing or invalid id");
            }
            std::string project_title = inputData["project_name"].get<std::string>();
            int project_id = inputData["id"].get<int>();
            nlohmann::json result = handler.updateProjectTitle(project_id, project_title);
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else if (command == "getProjectTitles") {
            nlohmann::json result = handler.getProjectTitles();
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else if (command == "patchCorpusName") {
            if (!inputData.contains("corpus_name") || !inputData["corpus_name"].is_string()) {
                throw std::runtime_error("Missing or invalid corpus_name");
            }
            if (!inputData.contains("id") || !inputData["id"].is_number_integer()) {
                throw std::runtime_error("Missing or invalid id");
            }
            std::string corpus_name { inputData["corpus_name"].get<std::string>() };
            int corpus_id { inputData["id"].get<int>() };
            nlohmann::json result = handler.updateCorpusName(corpus_id, corpus_name);
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else if (command == "postCorpusName") {
            if (!inputData.contains("corpus_name") || !inputData["corpus_name"].is_string()) {
                throw std::runtime_error("Missing or invalid corpus_name");
            }
            if (!inputData.contains("project_id") || !inputData["project_id"].is_number_integer()) {
                throw std::runtime_error("Missing or invalid id");
            }
            std::string corpus_name { inputData["corpus_name"].get<std::string>() };
            int project_id { inputData["project_id"].get<int>() };
            nlohmann::json result = handler.createCorpusName(project_id, corpus_name);
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else if (command == "getProjectMetadata") {
            if (!inputData.contains("id") || !inputData["id"].is_number_integer()) {
                throw std::runtime_error("Missing or invalid id");
            }
            int project_id { inputData["id"].get<int>() };
            nlohmann::json result = handler.getProjectMetadata(project_id);
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else if (command == "createCorpusGroup") {
            if (!inputData.contains("groupName") || !inputData["groupName"].is_string()) {
                throw std::runtime_error("Missing or invalid groupName");
            }
            if (!inputData.contains("corpus_id") || !inputData["corpus_id"].is_number_integer()) {
                throw std::runtime_error("Missing or invalid corpus_id");
            }
            std::string group_name { inputData["groupName"].get<std::string>() };
            int corpus_id { inputData["corpus_id"].get<int>() };
            nlohmann::json result = handler.createCorpusGroup(corpus_id, group_name);
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else if (command == "uploadFileContent") {
            if (!inputData.contains("file_content") || !inputData["file_content"].is_string()) {
                throw std::runtime_error("Missing or invalid file_content");
            }
            if (!inputData.contains("file_name") || !inputData["file_name"].is_string()) {
                throw std::runtime_error("Missing or invalid file_name");
            }
            if (!inputData.contains("group_id") || !inputData["group_id"].is_number_integer()) {
                throw std::runtime_error("Missing or invalid group_id");
            }
            int group_id { inputData["group_id"].get<int>() };
            std::string file_content { inputData["file_content"].get<std::string>() };
            std::string file_name { inputData["file_name"].get<std::string>() };
            nlohmann::json result = handler.uploadFileContent(group_id, file_content, file_name);
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else if (command == "patchCorpusGroup") {
            if (!inputData.contains("group_name") || !inputData["group_name"].is_string()) {
                throw std::runtime_error("Missing or invalid group_name");
            }
            if (!inputData.contains("id") || !inputData["id"].is_number_integer()) {
                throw std::runtime_error("Missing or invalid id");
            }
            int group_id { inputData["id"].get<int>() };
            std::string group_name { inputData["group_name"].get<std::string>() };
            nlohmann::json result = handler.updateCorpusGroupName(group_id, group_name);
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else if (command == "deleteAFile") {
            if (!inputData.contains("id") || !inputData["id"].is_number_integer()) {
                throw std::runtime_error("Missing or invalid id");
            }
            int file_id { inputData["id"].get<int>() };
            nlohmann::json result = handler.deleteAFile(file_id);
            std::cout << result.dump() << std::endl;
            std::cout.flush();
            
        } else if (command == "deleteSubcorpus") {
            int group_id { inputData["id"] };
            handler.deleteSubcorpus(group_id);

        } else if (command == "getFileText") {
            if (!inputData.contains("id") || !inputData["id"].is_number_integer()) {
                throw std::runtime_error("Missing or invalid id");
            }
            int file_id { inputData["id"].get<int>() };
            nlohmann::json result = handler.getFileText(file_id);
            std::cout << result.dump() << std::endl;
            std::cout.flush();

        } else {
            handleError("Unknown command: " + command, db);
        }
    } catch (const std::exception& e) {
        handleError(e.what(), db);
    }

    sqlite3_close(db);
    return 0;
}