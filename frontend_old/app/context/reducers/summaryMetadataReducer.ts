// Types
import { SummaryMetaData } from '../../types/types';
import { SummaryMetaDataActions } from '../contextTypes/contextTypes';

export const summaryMetaDataReducer = (summaryMetaData: SummaryMetaData, action: SummaryMetaDataActions) => {

    switch(action.type) {
        case 'initialize': {
            return action.summaryMetaData;
        }

        case 'update-corpus-status': {
            const { currentCorpusStatus } = action;
            return {
                ...summaryMetaData,
                currentCorpusStatus: currentCorpusStatus
            }
        }
            
        case 'update-word-counts': {
            const { wordCounts } = action;
            return {
                ...summaryMetaData,
                wordCounts: wordCounts
            }
        }
    }
}