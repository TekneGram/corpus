import { CorpusFilesPerSubCorpus } from '@/app/types/types';
// Types
import { CorpusMetaData } from "@/app/types/types";
import { CorpusMetaDataActions } from "../contextTypes/contextTypes";

export const corpusMetaDataReducer = (corpusMetaData: CorpusMetaData, action: CorpusMetaDataActions): CorpusMetaData => {
    switch (action.type) {
        case 'initialize': {
            return action.corpusMetadata;
        }

        case 'update-corpus-name': {
            corpusMetaData.corpus.corpus_name = action.corpusName;
            return {
                ...corpusMetaData,
            };
        }

        case 'add-new-subcorpus': {
            const { subCorpusName, subCorpusId } = action;
            return {
                ...corpusMetaData,
                files: [
                    ...corpusMetaData.files,
                    {
                        corpusFiles: [],
                        subCorpus: {
                            id: subCorpusId,
                            group_name: subCorpusName,
                        },
                    },
                ],
            };
        }

        case 'update-subcorpus-name': {
            return {
                ...corpusMetaData,
                files: corpusMetaData.files.map((file) => {
                    if (file.subCorpus.id === action.subCorpusId) {
                        return {
                            ...file,
                            subCorpus: {
                                ...file.subCorpus,
                                group_name: action.subCorpusName
                            }
                        }
                    }
                    return file;
                })
            };
        }

        case 'add-corpus-file': {
            const { subCorpusId, corpusFile } = action;
            return {
                ...corpusMetaData,
                files: corpusMetaData.files.map((filesPerSubCorpus) => {
                    if (filesPerSubCorpus.subCorpus.id === subCorpusId) {
                        return {
                            ...filesPerSubCorpus,
                            corpusFiles: [...filesPerSubCorpus.corpusFiles, corpusFile],
                        };
                    }
                    return filesPerSubCorpus;
                }),
            };
        }

        case 'delete-file': {
            const {subCorpusId, fileId } = action;
            return {
                ...corpusMetaData,
                files: corpusMetaData.files.map((filesPerSubCorpus) => {
                    if (filesPerSubCorpus.subCorpus.id === subCorpusId) {
                        return {
                            ...filesPerSubCorpus,
                            corpusFiles: filesPerSubCorpus.corpusFiles.filter(
                                (corpusFile) => corpusFile.id !== fileId
                            ),
                        };
                    }
                    return filesPerSubCorpus;
                })
            };
        }

        case 'delete-subcorpus': {
            const { subCorpusId } = action;
            return {
                ...corpusMetaData,
                files: corpusMetaData.files.filter(
                    (filesPerSubCorpus) => filesPerSubCorpus.subCorpus.id !== subCorpusId
                )
            };
        }

        default: {
            return corpusMetaData;
        }
    }
}