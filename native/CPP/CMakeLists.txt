cmake_minimum_required(VERSION 3.16)

project(corpusManager LANGUAGES CXX)

# ----------------------
# C++ Standard
# ----------------------
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# ----------------------
# SQLite
# ----------------------
find_package(SQLite3 REQUIRED)

# ----------------------
# Source files
# ----------------------
set(SOURCES
    corpusManagerMain.cpp
    domain/JSONConvert.cpp

    corpusAnalysis/CorpusAnalyzer.cpp

    db/Database.cpp
    db/StmtGuard.cpp
    db/TransactionGuard.cpp

    repositories/ManageProjectRepo.cpp
    repositories/ManageCorpusRepo.cpp
    repositories/ManageSubcorpusRepo.cpp
    repositories/ManageFilesRepo.cpp

    services/ManageCorpusService.cpp
)

# ----------------------
# Executable
# ----------------------
add_executable(corpusManager ${SOURCES})

# ----------------------
# Include directories
# ----------------------

target_include_directories(corpusManager PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/domain
    ${CMAKE_CURRENT_SOURCE_DIR}/db
    ${CMAKE_CURRENT_SOURCE_DIR}/repositories
    ${CMAKE_CURRENT_SOURCE_DIR}/services
    ${CMAKE_CURRENT_SOURCE_DIR}/corpusAnalysis
)

# ----------------------
# Link libraries
# ----------------------

target_link_libraries(corpusManager PRIVATE SQLite::SQLite3)

# ----------------------
# Output directory
# ----------------------

set_target_properties(corpusManager PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY
        ${CMAKE_CURRENT_SOURCE_DIR}/executables
)