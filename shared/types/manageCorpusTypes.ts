/**
 * Managing projects and corpora
 */
export type SelectableProjectTitle = {
    id: number;
    project_name: string;
    isSelected: boolean;
}

export type ProjectId = {
    id: number
};

export type ProjectTitle = {
    id: number;
    project_name: string;
};

export type Corpus = {
    id: number;
    corpus_name: string;
};

export type CorpusProjectRelation = {
    project_id: number;
    corpus_name: string;
}

export type SubCorpus = {
    id: number;
    group_name: string;
};

export type CorpusFile = {
    id: number;
    file_name: string;
};

export type CorpusFileContent = {
    group_id: number;
    file_name: string;
    file_content: string;
}

export type CorpusFilesPerSubCorpus = {
    corpusFiles: CorpusFile[];
    subCorpus: SubCorpus;
};

export type CorpusMetaData = {
    projectTitle: ProjectTitle;
    corpus: Corpus;
    files: CorpusFilesPerSubCorpus[];
};

// With commands for sending to C++
export type ProjectIdWithCommand = ProjectId & {
    command: string;
}

export type ProjectTitleWithCommand = ProjectTitle & {
    command: string;
};

export type CorpusProjectRelationWithCommand = CorpusProjectRelation & {
    command: string;
};

export type CorpusWithCommand = Corpus & {
    command: string;
}

export type PostGroupNameWithCommand = {
    corpus_id: number,
    groupName: string,
    command: string;
}

export type SubCorpusWithCommand = SubCorpus & {
    command: string;
}

export type CorpusFileContentWithCommand = CorpusFileContent & {
    command: string;
}

export type CorpusFileWithCommand = CorpusFile & {
    command: string;
}

// Database Returns
export type DeleteFileResult = {
    success: boolean;
    fileDeleted: boolean;
    groupDeleted: boolean;
    groupId: number;
    message: string;
}

export type DeleteSubCorpusResult = {
    success: boolean;
    groupId: number;
    message: string;
}

// For handling empty cppOutput returns
export type EmptyCPPOutput = {
    id: number;
    message: string;
}

/**
 * Viewing files
 */

export type FileUploadResult = {
    successFiles: CorpusFile[];
    failedFiles: string[];
}

export type FileUploadError = 
    | { type: 'partial'; failedFiles: string[] }
    | { type: 'unexpected'; message: string};

// Text from the database
export type FileText = {
    id: number;
    file_text: string;
}

/**
 * Monitoring the state of the corpus in the database
 */
// Checking files exist in the corpus
export type HasFiles = {
    corpus_id: number;
    has_files: boolean;
}

// Summarizing the corpus
export type CorpusState = {
    analysis_type: string | null;
    up_to_date: boolean | null;
}

export type CorpusPreppedState = {
    corpus_id: number;
    analysis_type: string | null;
    up_to_date: boolean | null;
}

export type CurrentCorpusState = {
    hasFiles: HasFiles;
    corpusPreppedState: CorpusPreppedState;
}

/**
 * Managing word count and word list data
 */

// Word counts in the corpus
export type WordCountsPerCorpus = {
    corpusId: number;
    typeCount: number;
    tokenCount: number;
}

// Word counts in the group (subcorpus)
export type SubcorpusWordCounts = {
    groupId: number;
    groupName: string;
    typeCount: number;
    tokenCount: number;
}

export type WordCountsPerSubcorpus = {
    corpusId: number;
    subcorpusWordCounts: SubcorpusWordCounts[];
}

// Word counts in the individual files
export type FileWordCounts = {
    fileId: number;
    groupId: number;
    fileName: string;
    typeCount: number;
    tokenCount: number;
}

export type WordCountsPerFile = {
    corpusId: number;
    fileWordCounts: FileWordCounts[];
}

// All data collated together
export type WordCounts = {
    wordCountsPerCorpus: WordCountsPerCorpus;
    wordCountsPerSubcorpus: WordCountsPerSubcorpus;
    wordCountsPerFile: WordCountsPerFile;
}

/**
 * All summary metadata collated
 */

export type SummaryMetaData = {
    currentCorpusState: CurrentCorpusState;
    wordCounts: WordCounts;
}