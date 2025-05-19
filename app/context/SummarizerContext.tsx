import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
// import { SummaryMetaData } from '@/apps/types/types';
// import { SummaryMetaDataActions } from './contextTypes/contextTypes';
import { summaryMetaDataReducer } from './reducers/summaryMetadataReducer';

// Create context
// TEMP: Using 'any' to avoid errors while scaffolding
const SummaryContext = createContext<{
    summaryMetaData: any;
    dispatch: Dispatch<any>
}>({
    summaryMetaData: [], // Initial state
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