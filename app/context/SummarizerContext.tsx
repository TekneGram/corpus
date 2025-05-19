import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { SummaryMetaData } from '@/app/types/types';
// import { SummaryMetaDataActions } from './contextTypes/contextTypes';
import { summaryMetaDataReducer } from './reducers/summaryMetadataReducer';

// Set an initial value for the summaryMetaData state which is what gets updated through the reducer
const initialSummaryMetaData = {
    currentCorpusStatus: {
        hasFiles: {
            corpus_id: 0,
            has_files: false
        },
        corpusStatus: {
            analysis_type: '',
            up_to_date: false
        }
    },
    wordCounts: {
        wordCountsPerCorpus: {
            corpusId: 0,
            typeCount: 0,
            tokenCount: 0
        },
        wordCountsPerGroup: {
            corpusId: 0,
            groupWordCounts: []
        },
        wordCountsPerFile: {
            corpusId: 0,
            fileWordCounts: []
        }
    }
};

// Create context
// TEMP: Using 'any' to avoid errors while scaffolding
const SummaryContext = createContext<{
    summaryMetaData: SummaryMetaData;
    dispatch: Dispatch<any>
}>({
    summaryMetaData: initialSummaryMetaData, // Initial state
    dispatch: () => {} // No-op dispatch for placeholder.
});

interface SummaryProviderProps {
    children: ReactNode;
}

export const SummaryProvider: React.FC<SummaryProviderProps> = ({ children }) => {
    const [summaryMetaData, dispatch] = useReducer(summaryMetaDataReducer, []);

    return (
        <SummaryContext.Provider value={{summaryMetaData, dispatch}}>
            {children}
        </SummaryContext.Provider>
    )
}

// Custom hook for convenience
export function useSummaryContext() {
    return useContext(SummaryContext);
}