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
        case 'reload-corpus-metadata': {
            
            return action.corpusMetadata;
        }
        default: {
            return corpusMetaData;
        }
    }
}