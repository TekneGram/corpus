import type { ProjectTitle, Corpus, SubCorpus, CorpusFile, CorpusFilesPerSubCorpus, CorpusMetaData, FileText, DeleteFileResult, DeleteSubCorpusResult } from "@shared/types/manageCorpusTypes";

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

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