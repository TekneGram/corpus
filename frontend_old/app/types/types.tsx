/**
 * Managing projects and corpora
 */
export type SelectableProjectTitle = {
    id: number;
    project_name: string;
    isSelected: boolean;
}

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

export type CorpusFilesPerSubCorpus = {
    corpusFiles: CorpusFile[];
    subCorpus: SubCorpus;
};

export type CorpusMetaData = {
    projectTitle: ProjectTitle;
    corpus: Corpus;
    files: CorpusFilesPerSubCorpus[];
};

// For handling empty cppOutput returns
export type EmptyCPPOutput = {
    id: number;
    message: string;
}

/**
 * Viewing files
 */

// Text from the database
export type FileText = {
    id: number;
    file_text: string;
}

/**
 * Monitoring the status of the corpus in the database
 */
// Checking files exist in the corpus
export type HasFiles = {
    corpus_id: number;
    has_files: boolean;
}

// Summarizing the corpus
export type CorpusStatus = {
    analysis_type: string | null;
    up_to_date: boolean | null;
}

export type CorpusPreppedStatus = {
    corpus_id: number;
    analysis_type: string | null;
    up_to_date: boolean | null;
}

export type CurrentCorpusStatus = {
    hasFiles: HasFiles;
    corpusStatus: CorpusStatus;
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
export type GroupWordCounts = {
    groupId: number;
    groupName: string;
    typeCount: number;
    tokenCount: number;
}

export type WordCountsPerGroup = {
    corpusId: number;
    groupWordCounts: GroupWordCounts[];
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
    wordCountsPerGroup: WordCountsPerGroup;
    wordCountsPerFile: WordCountsPerFile;
}

/**
 * All summary metadata collated
 */

export type SummaryMetaData = {
    currentCorpusStatus: CurrentCorpusStatus;
    wordCounts: WordCounts;
}