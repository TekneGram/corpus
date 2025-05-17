
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

// Text from the database
export type FileText = {
    id: number;
    file_text: string;
}

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