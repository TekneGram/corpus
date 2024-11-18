#include "DatabaseHandler.h"
#include <sqlite3.h>
#include <iostream>
#include "./lib/json.hpp"
#include "CorpusMetadata.h"

DatabaseHandler::DatabaseHandler(sqlite3* db)
{
    dbConn = db;
}
void DatabaseHandler::startNewProject(const std::string& project_title)
{
    sqlite3_stmt* statement;
    const char* sql = "INSERT INTO project (project_name) VALUES (?);";
    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement " << sqlite3_errmsg(dbConn) << std::endl;
    }
    sqlite3_bind_text(statement, 1, project_title.c_str(), -1, SQLITE_STATIC);

    int exit_code = sqlite3_step(statement);
    if (exit_code != SQLITE_DONE) {
        std::cerr << "Error inserting data: " << sqlite3_errmsg(dbConn);
        sqlite3_finalize(statement);
    }
    std::cout << "Project successfully created!\n";
    sqlite3_finalize(statement);
}

nlohmann::json DatabaseHandler::getProjectTitles()
{
    std::vector<CorpusMetadata::ProjectTitle> projectTitles;
    sqlite3_stmt* statement;
    const char* sql = "SELECT project.id, project.project_name "
                        "FROM project;";
    if (sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement " << sqlite3_errmsg(dbConn) << std::endl;
        // Convert empty array of titles to JSON to return
        nlohmann::json projectTitlesJSON = projectTitles;
        return projectTitlesJSON;
    }

    while (sqlite3_step(statement) == SQLITE_ROW) {
        CorpusMetadata::ProjectTitle aProjectTitle {
            sqlite3_column_int(statement, 0),
            reinterpret_cast<const char*>(sqlite3_column_text(statement, 1))
        };
        projectTitles.push_back(aProjectTitle);
    }

    if (sqlite3_finalize(statement) != SQLITE_OK) {
        std::cerr << "Error finalizing statement: " << sqlite3_errmsg(dbConn) << std::endl;
    }

    // Convert to json for return
    nlohmann::json projectTitlesJSON = projectTitles;
    return projectTitles;
}

void DatabaseHandler::createCorpusName(const int& project_id, const std::string& corpus_name)
{
    sqlite3_stmt* statement; // Pointer to a prepared statement

    const char* sql = "INSERT INTO corpus (corpus_name, project_id) VALUES (?, ?);";
    int exit_code = sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr);
    if (exit_code != SQLITE_OK) {
        std::cerr << "Error preparing statement: " << sqlite3_errmsg(dbConn) << std::endl;
    }
    sqlite3_bind_text(statement, 1, corpus_name.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(statement, 2, project_id);

    exit_code = sqlite3_step(statement);
    if (exit_code != SQLITE_DONE) {
        std::cerr << "Error inserting data: " << sqlite3_errmsg(dbConn);
        sqlite3_finalize(statement);
    }
    std::cout << "Data inserted successfully!\n";
    sqlite3_finalize(statement);
}

void DatabaseHandler::updateCorpusName(const int& corpus_id, const std::string& corpus_name)
{
    sqlite3_stmt* statement;

    const char* sql = "UPDATE corpus SET corpus_name = ? WHERE id = ?;";
    int exit_code = sqlite3_prepare_v2(dbConn, sql, -1, &statement, nullptr);
    if (exit_code != SQLITE_OK) {
        std::cerr << "Error preparing statement: " << sqlite3_errmsg(dbConn) << std::endl;
        return;
    }
    // Bind parameters
    exit_code = sqlite3_bind_text(statement, 1, corpus_name.c_str(), -1, SQLITE_STATIC);
    if (exit_code != SQLITE_OK) {
            std::cerr << "Error binding corpus_name: " << sqlite3_errmsg(dbConn) << std::endl;
            sqlite3_finalize(statement);
            return;
    }
    exit_code = sqlite3_bind_int(statement, 2, corpus_id);
    if (exit_code != SQLITE_OK) {
            std::cerr << "Error binding corpus_id: " << sqlite3_errmsg(dbConn) << std::endl;
            sqlite3_finalize(statement);
            return;
    }

    // Run the query
    exit_code = sqlite3_step(statement);
    if (exit_code != SQLITE_DONE) {
        std::cerr << "Error updating data: " << sqlite3_errmsg(dbConn) << std::endl;
        sqlite3_finalize(statement);
        return;
    }
    std::cout << "Corpus name updated successfully!\n";
    sqlite3_finalize(statement);
}

nlohmann::json DatabaseHandler::getProjectMetadata(const int& project_id)
{
    /**
     * Things to improve later
     * 1. Add errorJSON["error"] to all empty returns
     * 2. Use pagination if number of files gets large
     * 3. validate project and corpus ids
     * 4. improve error logging
     * 5. separate database logic and business logic with helper functions
     * 6. Memory safety if dbConn is lost
     * 7. Sanity check for corpus metadata construction after first query.
     */
    CorpusMetadata::CorpusMetadata corpusMetadata;
    sqlite3_stmt* stmt;

    // First set up the emptyCorpusMetadata object to return if there are errors
    nlohmann::json emptyCorpusMetadataJSON;
    auto createEmptyCorpusMetadata = [&]() {
        if (emptyCorpusMetadataJSON.empty()) {
            CorpusMetadata::ProjectTitle pt { 0, "" };
            CorpusMetadata::Corpus corp { 0, "" };
            CorpusMetadata::CorpusFile corpF { 0, "" };
            std::vector<CorpusMetadata::CorpusFile> corpFs;
            corpFs.push_back(corpF);
            CorpusMetadata::SubCorpus subCorp { 0, "" };
            CorpusMetadata::CorpusFilesPerSubCorpus fpSubCorp { subCorp, corpFs };
            std::vector<CorpusMetadata::CorpusFilesPerSubCorpus> fs;
            fs.push_back(fpSubCorp);
            CorpusMetadata::CorpusMetadata emptyCorpusMetadata { pt, corp, fs };
            emptyCorpusMetadataJSON = emptyCorpusMetadata;
        }
        return emptyCorpusMetadataJSON;
    };
    
    // Begin the first query
    const char* sql = "SELECT project.project_name, corpus.id, corpus.corpus_name "
                    "FROM project "
                    "LEFT JOIN corpus ON project.id = corpus.project_id "
                    "WHERE project.id = ?;";
    

    // Prepare the sql statement
    if (sqlite3_prepare_v2(dbConn, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement " << sqlite3_errmsg(dbConn) << std::endl;
        return createEmptyCorpusMetadata();
    }

    // Bind the project_id parameter to the statement
    if (sqlite3_bind_int(stmt, 1, project_id) != SQLITE_OK) {
        std::cerr << "Error binding data to statement " << sqlite3_errmsg(dbConn);
        return createEmptyCorpusMetadata();
    }

    bool hasResults = false;
    // Execute the query and process the results
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        hasResults = true;

        // Set up the ProjectTitle struct
        CorpusMetadata::ProjectTitle projectTitle = {
            project_id,
            reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0))
        };

        // Add the project title to the corpusMetadata object
        corpusMetadata.projectTitle = projectTitle;

        // Get corpus data if available, otherwise, set to default for TypeScript on front end
        if (sqlite3_column_type(stmt, 1) != SQLITE_NULL && sqlite3_column_type(stmt, 2) != SQLITE_NULL) {
            const char* columnText = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2));
            std::string projectName = columnText ? columnText : ""; // because columnText might be a nullptr type
            CorpusMetadata::Corpus corpus {
                sqlite3_column_int(stmt, 1),
                projectName
            };
            
            // Add the corpus information to the corpusMetadata object
            corpusMetadata.corpus = corpus;
        } 
    }
    sqlite3_finalize(stmt);

    if(!hasResults) {
        nlohmann::json errorJSON = createEmptyCorpusMetadata();
        errorJSON["error"] = "No data found for the given project.";
        return errorJSON;
    }

    // Check that there was data available in the database:
    if (corpusMetadata.corpus.id == 0) {
        // Essentially, empty data will be sent back to the front end
        return createEmptyCorpusMetadata();
    }

    // If data exists, make the next query
    sqlite3_stmt* stmt2;

    const char* sql2 = R"(
        SELECT corpus_group.id AS group_id,
            corpus_group.group_name,
            files.id AS file_id,
            files.file_name
        FROM corpus_group
        JOIN files ON corpus_group.id = files.group_id
        WHERE corpus_group.corpus_id = ?
    )";

    if (sqlite3_prepare_v2(dbConn, sql2, -1, &stmt2, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(dbConn) << std::endl;
        // Return the empty corpus metadata due to error
        sqlite3_finalize(stmt2);
        return createEmptyCorpusMetadata();
    }

    if (sqlite3_bind_int(stmt2, 1, corpusMetadata.corpus.id) != SQLITE_OK) {
        std::cerr << "Error binding corpus id data to statement" << std::endl;
        sqlite3_finalize(stmt2);
        // Return the empty corpus metadata due to error
        return createEmptyCorpusMetadata();
    }

    std::map<int, CorpusMetadata::CorpusFilesPerSubCorpus> subCorpusMap;

    while (sqlite3_step(stmt2) == SQLITE_ROW) {
        // group_id
        int group_id = sqlite3_column_int(stmt2, 0);
        const char* col_text_1 = reinterpret_cast<const char*>(sqlite3_column_text(stmt2, 1));
        std::string group_name = col_text_1 ? col_text_1 : ""; // accounts for nullptr from database
        
        // file_id
        int file_id = sqlite3_column_int(stmt2, 2);
        const char* col_text_2 = reinterpret_cast<const char*>(sqlite3_column_text(stmt2, 3));
        std::string file_name = col_text_2 ? col_text_2 : ""; // accounts for nullptr from database

        // Create a CorpusFile struct
        CorpusMetadata::CorpusFile corpusFile = {file_id, file_name};

        // Check if the group_id exists in the map, else create it
        if (subCorpusMap.find(group_id) == subCorpusMap.end()) {
            CorpusMetadata::SubCorpus subCorpus{group_id, group_name};
            subCorpusMap[group_id] = CorpusMetadata::CorpusFilesPerSubCorpus{subCorpus, {}};
        }

        // Add the file to the appropriate subCorpus's file list
        subCorpusMap[group_id].corpusFiles.push_back(corpusFile);

    }

    sqlite3_finalize(stmt2);

    // Transfer data from map to vector in corpusMetadata
    for (const auto &entry : subCorpusMap) {
        corpusMetadata.files.push_back(entry.second);
    }

    // Convert into JSON and return
    nlohmann::json corpusMetadataJSON = corpusMetadata;
    return corpusMetadataJSON;
}


// void DatabaseHandler::createGroup()
// {

// }

// void DatabaseHandler::insertFile()
// {

// }

// void DatabaseHandler::insertWords()
// {

// }

// void DatabaseHandler::insertColls()
// {

// }

// void DatabaseHandler::insertThreeBuns()
// {

// }

// void DatabaseHandler::insertFourBuns()
// {

// }