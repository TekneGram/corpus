import type { ProjectTitle, Corpus, SubCorpus, CorpusFile, CorpusFilesPerSubCorpus, CorpusMetaData, FileText, DeleteFileResult, DeleteSubCorpusResult, HasFiles, CorpusState, CorpusPreppedState, WordCountsPerCorpus, SubcorpusWordCounts, WordCountsPerSubcorpus, FileWordCounts, WordCountsPerFile, WordCounts, CurrentCorpusState, SummaryMetaData } from "@shared/types/manageCorpusTypes";

// Helper functions
function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

// This helper function checks that each element in an array if of type T
function isArrayOf<T>(
    value: unknown,
    elementGuard: (v: unknown) => v is T
): value is T[] {
    return Array.isArray(value) && value.every(elementGuard)
}

// type guards.
export function isProjectTitle(value: unknown): value is ProjectTitle {
    return (
        isObject(value) &&
        typeof value.id === "number" &&
        typeof value.project_name === "string"
    );
}

export function isCorpus(value: unknown): value is Corpus {
    return (
        isObject(value) &&
        typeof value.id === "number" &&
        typeof value.corpus_name === "string"
    );
}

export function isSubCorpus(value: unknown): value is SubCorpus {
    return (
        isObject(value) &&
        typeof value.id === "number" &&
        typeof value.group_name === "string"
    );
}

export function isCorpusFile(value: unknown): value is CorpusFile {
    return (
        isObject(value) &&
        typeof value.id === "number" &&
        typeof value.file_name === "string"
    );
}

export function isCorpusFilesPerSubCorpus(
    value: unknown
): value is CorpusFilesPerSubCorpus {
    return (
        isObject(value) &&
        Array.isArray(value.corpusFiles) &&
        value.corpusFiles.every(isCorpusFile) &&
        isSubCorpus(value.subCorpus)
    );
}

export function isCorpusMetaData(
    value: unknown
): value is CorpusMetaData {
    return (
        isObject(value) &&
        isProjectTitle(value.projectTitle) &&
        isCorpus(value.corpus) &&
        Array.isArray(value.files) &&
        value.files.every(isCorpusFilesPerSubCorpus)
    );
}

export function isFileText(
    value: unknown
): value is FileText {
    return (
        isObject(value) &&
        typeof value.id === "number" &&
        typeof value.file_text === "string"
    );
}

export function isDeleteFileResult(
    value: unknown
): value is DeleteFileResult {
    return (
        isObject(value) &&
        typeof value.success === "boolean" &&
        typeof value.fileDeleted === "boolean" &&
        typeof value.groupDeleted === "boolean" &&
        typeof value.groupId === "number" &&
        typeof value.message === "string"
    );
}

export function isDeleteSubCorpusResult(
    value: unknown
): value is DeleteSubCorpusResult {
    return (
        isObject(value) &&
        typeof value.success === "boolean" &&
        typeof value.groupId === "number" &&
        typeof value.message === "string"
    )
}


// typeguards for corpus state
export function isHasFiles(
    value: unknown
): value is HasFiles {
    return (
        isObject(value) &&
        typeof value.corpus_id === "number" &&
        typeof value.has_files === "boolean"
    )
}

export function isCorpusPreppedState(
    value: unknown
): value is CorpusPreppedState {
    return (
        isObject(value) &&
        typeof value.corpus_id === "number" &&
        (value.analysis_type === null || typeof value.analysis_type === "string") &&
        (value.up_to_date === null || typeof value.up_to_date === "boolean")
    );
}

export function isCurrentCorpusState(
    value: unknown
): value is CurrentCorpusState {
    return (
        isObject(value) &&
        isHasFiles(value.hasFiles) &&
        isCorpusPreppedState(value.corpusPreppedState)
    );
}


// typeguards for word counts and summarizer metadata
export function isWordCountsPerCorpus(
    value: unknown
): value is WordCountsPerCorpus {
    return (
        isObject(value) &&
        typeof value.corpusId === "number" &&
        typeof value.typeCount === "number" &&
        typeof value.tokenCount === "number"
    );
}

export function isSubcorpusWordCounts (
    value: unknown
): value is SubcorpusWordCounts {
    return (
        isObject(value) &&
        typeof value.groupId === "number" &&
        typeof value.groupName === "string" &&
        typeof value.typeCount == "number" &&
        typeof value.tokenCount === "number"
    );
}

export function isWordCountsPerSubcorpus (
    value: unknown
): value is WordCountsPerSubcorpus {
    return (
        isObject(value) &&
        typeof value.corpusId === "number" &&
        isArrayOf(value.subcorpusWordCounts, isSubcorpusWordCounts)
    );
}

export function isFileWordCounts (
    value: unknown
): value is FileWordCounts {
    return (
        isObject(value) &&
        typeof value.fileId === "number" &&
        typeof value.groupId === "number" &&
        typeof value.fileName === "string" &&
        typeof value.typeCount === "number" &&
        typeof value.tokenCount === "number"
    );
}

export function isWordCountsPerFile (
    value: unknown
): value is WordCountsPerFile {
    return (
        isObject(value) &&
        typeof value.corpusId === "number" &&
        isArrayOf(value.fileWordCounts, isFileWordCounts)
    )
}

export function isWordCounts (
    value: unknown
): value is WordCounts {
    return (
        isObject(value) &&
        isWordCountsPerCorpus(value.wordCountsPerCorpus) &&
        isWordCountsPerSubcorpus(value.wordCountsPerSubcorpus) &&
        isWordCountsPerFile(value.wordCountsPerFile)
    );
}

export function isSummaryMetaData (
    value: unknown
): value is SummaryMetaData {
    return (
        isObject(value) &&
        isCurrentCorpusState(value.currentCorpusState) &&
        isWordCounts(value.wordCounts)
    );
}