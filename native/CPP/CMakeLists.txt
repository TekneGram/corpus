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
    JSONConvert.cpp

    corpusAnalysis/CorpusAnalyzer.cpp

    DatabaseHandler/Connection.cpp
    DatabaseHandler/ManageCorpusFiles.cpp
    DatabaseHandler/ManageCorpusQueries.cpp
    DatabaseHandler/ManageProjectQueries.cpp
    DatabaseHandler/ManageSubCorpusQueries.cpp
    DatabaseHandler/StmtGuard.cpp
    DatabaseHandler/TransactionGuard.cpp
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
    ${CMAKE_CURRENT_SOURCE_DIR}/DatabaseHandler
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
        ${CMAKE_CURRENT_SOURCE_DIR}/executablesRefactored
)