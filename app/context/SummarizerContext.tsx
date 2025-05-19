import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { SummaryMetaData } from '@/app/types/types';
import { SummaryMetaDataActions } from './contextTypes/contextTypes';
import { summaryMetaDataReducer } from './reducers/summaryMetadataReducer';

// Set an initial value for the summaryMetaData state which is what gets updated through the reducer
const initialSummaryMetaData: SummaryMetaData = {
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

// Create context for the metadata
// TEMP: Using 'any' to avoid errors while scaffolding
const SummaryContext = createContext<{
    summaryMetaData: SummaryMetaData;
    dispatch: Dispatch<any>
}>({
    summaryMetaData: initialSummaryMetaData, // Initial state defined above
    dispatch: () => {} // No-op dispatch for placeholder.
});

// Create context for the dispatch to the reducer
const noop = () => {
    throw new Error ("Summary dispatch function must be used within a summary context provider")
}
const SummaryDispatch = createContext<Dispatch<SummaryMetaDataActions>>(noop);

// Interface
interface SummaryProviderProps {
    children: ReactNode;
}

// Provider
export const SummaryProvider: React.FC<SummaryProviderProps> = ({ children }) => {
    const [summaryMetaData, dispatch] = useReducer<React.Reducer<SummaryMetaData, SummaryMetaDataActions>>(
        summaryMetaDataReducer,
        initialSummaryMetaData
    );

    return (
        <SummaryContext.Provider value={{summaryMetaData, dispatch}}>
            <SummaryDispatch.Provider value={dispatch}>
                {children}
            </SummaryDispatch.Provider>
        </SummaryContext.Provider>
    )
}

// Custom hooks for convenience
export function useSummaryContext() {
    return useContext(SummaryContext);
}

export function useSummaryDispatch() {
    return useContext(SummaryDispatch);
}