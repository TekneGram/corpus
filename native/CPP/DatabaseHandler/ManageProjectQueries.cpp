#include "DatabaseHandler.h"
#include "TransactionGuard.h"
#include "StmtGuard.h"

#include <stdexcept>
#include <map>

CorpusMetadata::ProjectTitle DatabaseHandler::startNewProject(const std::string& project_title)
{
    TransactionGuard tsx(dbConn);

    sqlite3_stmt* raw = nullptr;

    const char* sql = "INSERT INTO project (project_name) VALUES (?);";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &raw, nullptr) != SQLITE_OK)
        throw std::runtime_error(std::string("Prepare failed: ") + sqlite3_errmsg(dbConn));
    
    StmtGuard stmt(raw);

    if (sqlite3_bind_text(stmt.get(), 1, project_title.c_str(), -1, SQLITE_TRANSIENT) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind failed:") + sqlite3_errmsg(dbConn));

    if (sqlite3_step(stmt.get()) != SQLITE_DONE)
        throw std::runtime_error(std::string("Insert failed: ") + sqlite3_errmsg(dbConn));

    int project_id = static_cast<int>(sqlite3_last_insert_rowid(dbConn));

    tsx.commit();

    CorpusMetadata::ProjectTitle pt =  {
        project_id,
        project_title
    };

    return pt;
}

CorpusMetadata::ProjectTitle DatabaseHandler::updateProjectTitle(const int& project_id, const std::string& project_title)
{
    TransactionGuard txn(dbConn);

    sqlite3_stmt* rawStmt = nullptr;
    const char* sql =
        "UPDATE project SET project_name = ? WHERE id = ?;";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(std::string("Prepare failed:") + sqlite3_errmsg(dbConn));

    StmtGuard stmt(rawStmt);

    if (sqlite3_bind_text(stmt.get(), 1, project_title.c_str(), -1, SQLITE_TRANSIENT) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind failed:") + sqlite3_errmsg(dbConn));

    if (sqlite3_bind_int(stmt.get(), 2, project_id) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind failed:") + sqlite3_errmsg(dbConn));

    if (sqlite3_step(stmt.get()) != SQLITE_DONE)
        throw std::runtime_error(std::string("Insert failed:") + sqlite3_errmsg(dbConn));

    txn.commit();

    CorpusMetadata:: ProjectTitle pt =  {
        project_id,
        project_title
    };

    return pt;
}

std::vector<CorpusMetadata::ProjectTitle> DatabaseHandler::getProjectTitles()
{
    std::vector<CorpusMetadata::ProjectTitle> projectTitles;

    sqlite3_stmt* rawStmt = nullptr;
    const char* sql =
        "SELECT project.id, project.project_name FROM project;";

    if (sqlite3_prepare_v2(dbConn, sql, -1, &rawStmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(std::string("Prepare failed:") + sqlite3_errmsg(dbConn));

    StmtGuard stmt(rawStmt);

    while (true) {
        int rc = sqlite3_step(stmt.get());

        if (rc == SQLITE_ROW) {
            // Note - emplace_back is the same as push_back to insert an object into a vector
            // but with emplace_back the vector makes space and then the object is constructed inside the
            // vector; no copying and moving the object into the vector.
            // However, since the ProjectTitle in CorpusMetadata does not have a constructor
            // and making one will complicate the json conversion, it is easier to use push_back here
            // with only a VERY small overhead due to copy and move!
            projectTitles.push_back({
                sqlite3_column_int(stmt.get(), 0),
                reinterpret_cast<const char*>(
                    sqlite3_column_text(stmt.get(), 1)
                )
            });
        }
        else if (rc == SQLITE_DONE) {
            break;
        }
        else {
            throw std::runtime_error(sqlite3_errmsg(dbConn));
        }
    }

    return projectTitles;
}

CorpusMetadata::CorpusMetadata DatabaseHandler::getProjectMetadata(const int& project_id)
{
    CorpusMetadata::CorpusMetadata corpusMetadata;

    /* =========================
       Query 1: Project + Corpus
       ========================= */

    sqlite3_stmt* rawStmt1 = nullptr;

    const char* sql1 = R"(
        SELECT project.project_name,
               corpus.id,
               corpus.corpus_name
        FROM project
        LEFT JOIN corpus ON project.id = corpus.project_id
        WHERE project.id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql1, -1, &rawStmt1, nullptr) != SQLITE_OK)
        throw std::runtime_error(std::string("Prepare failed:") + sqlite3_errmsg(dbConn));

    StmtGuard stmt1(rawStmt1);

    if (sqlite3_bind_int(stmt1.get(), 1, project_id) != SQLITE_OK)
        throw std::runtime_error(std::string("Bind failed:") + sqlite3_errmsg(dbConn));

    bool hasRow = false;

    while (true) {
        int rc = sqlite3_step(stmt1.get());

        if (rc == SQLITE_ROW) {
            hasRow = true;

            corpusMetadata.projectTitle = {
                project_id,
                reinterpret_cast<const char*>(
                    sqlite3_column_text(stmt1.get(), 0)
                )
            };

            if (sqlite3_column_type(stmt1.get(), 1) != SQLITE_NULL &&
                sqlite3_column_type(stmt1.get(), 2) != SQLITE_NULL) {

                const char* text =
                    reinterpret_cast<const char*>(
                        sqlite3_column_text(stmt1.get(), 2)
                    );

                corpusMetadata.corpus = {
                    sqlite3_column_int(stmt1.get(), 1),
                    text ? text : ""
                };
            }
        }
        else if (rc == SQLITE_DONE) {
            break;
        }
        else {
            throw std::runtime_error(sqlite3_errmsg(dbConn));
        }
    }

    if (!hasRow)
        throw std::runtime_error("No project found for given project_id");

    if (corpusMetadata.corpus.id == 0)
        return corpusMetadata;  // valid but empty corpus

    /* =========================
       Query 2: Groups + Files
       ========================= */

    sqlite3_stmt* rawStmt2 = nullptr;

    const char* sql2 = R"(
        SELECT corpus_group.id,
               corpus_group.group_name,
               files.id,
               files.file_name
        FROM corpus_group
        JOIN files ON corpus_group.id = files.group_id
        WHERE corpus_group.corpus_id = ?;
    )";

    if (sqlite3_prepare_v2(dbConn, sql2, -1, &rawStmt2, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    StmtGuard stmt2(rawStmt2);

    if (sqlite3_bind_int(stmt2.get(), 1, corpusMetadata.corpus.id) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(dbConn));

    std::map<int, CorpusMetadata::CorpusFilesPerSubCorpus> subCorpusMap;

    while (true) {
        int rc = sqlite3_step(stmt2.get());

        if (rc == SQLITE_ROW) {
            int group_id = sqlite3_column_int(stmt2.get(), 0);

            const char* groupText =
                reinterpret_cast<const char*>(
                    sqlite3_column_text(stmt2.get(), 1)
                );

            int file_id = sqlite3_column_int(stmt2.get(), 2);

            const char* fileText =
                reinterpret_cast<const char*>(
                    sqlite3_column_text(stmt2.get(), 3)
                );

            if (subCorpusMap.find(group_id) == subCorpusMap.end()) {
                subCorpusMap[group_id] = {
                    { group_id, groupText ? groupText : "" },
                    {}
                };
            }

            subCorpusMap[group_id].corpusFiles.push_back({
                file_id,
                fileText ? fileText : ""
            });
        }
        else if (rc == SQLITE_DONE) {
            break;
        }
        else {
            throw std::runtime_error(sqlite3_errmsg(dbConn));
        }
    }

    for (const auto& entry : subCorpusMap)
        corpusMetadata.files.push_back(entry.second);

    return corpusMetadata;
}