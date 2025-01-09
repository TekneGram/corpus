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
            return corpusMetaData;
        }

        case 'add-corpus-file': {
            const { subCorpusId, corpusFile } = action;
            console.log("Reducer update:", action.subCorpusId, action.corpusFile);
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

        case 'reload-corpus-metadata': {
            
            return action.corpusMetadata;
        }

        default: {
            return corpusMetaData;
        }
    }
}