#include "DatabaseHandler.h"
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
    int exit_code = sqlite3_open("./database/corpus.sqlite", &db);
    if (exit_code) {
        handleError(sqlite3_errmsg(db), db);
    }

    DatabaseHandler handler(db);

    try {
        if (command == "startNewProject") {
            std::string project_title = inputData["projectTitle"];
            handler.startNewProject(project_title);
            std::cout << "Project successfully created!" << std::endl;

        } else if (command == "updateProjectTitle") {
            std::string project_title = inputData["projectTitle"];
            int project_id = inputData["projectId"];
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
            nlohmann::json result = handler.createCorpusName(project_id, corpus_name);;
            std::cout << result.dump() << std::endl;

        } else if (command == "getProjectMetadata") {
            int project_id { inputData["projectId"] };
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
            int group_id { inputData["group_id"] };
            std::string group_name { inputData["groupName"] };
            nlohmann::json result = handler.updateCorpusGroupName(group_id, group_name);
            std::cout << result.dump() << std::endl;

        } else if (command == "deleteAFile") {
            int file_id { inputData["fileId"] };
            handler.deleteAFile(file_id);
            
        } else if (command == "deleteSubcorpus") {
            int group_id { inputData["groupId"] };
            handler.deleteSubcorpus(group_id);

        } else if (command == "getFileText") {
            int file_id { inputData["fileId"] };
            nlohmann::json result = handler.getFileText(file_id);
            std::cout << result.dump() << std::endl;
        }
    } catch (const std::exception& e) {
        handleError(e.what(), db);
    }

    sqlite3_close(db);
    return 0;
}