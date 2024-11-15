
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