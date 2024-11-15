import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { CorpusMetaData } from '@/app/types/types';
import { CorpusMetaDataActions } from './contextTypes/contextTypes';
import { corpusMetaDataReducer } from './reducers/corpusMetadataReducer';

/**
 * TO DO
 */
//import { loadCorpusMetaData } from "../ipcRenderer/corpusEdits";
const initialCorpusMetaData: CorpusMetaData = {
    projectTitle: {
        id: 0,
        project_name: '',
    },
    corpus: {
        id: 0,
        corpus_name: '',
    },
    files: [],
};

const noop = () => {
    throw new Error ("Dispatch function must be used within a corpus provider")
}

const CorpusContext = createContext<CorpusMetaData>(initialCorpusMetaData);
const CorpusDispatchContext = createContext<Dispatch<CorpusMetaDataActions>>(noop);

interface CorpusProviderProps {
    children: ReactNode;
}

export const CorpusProvider: React.FC<CorpusProviderProps> = ({ children }) => {

    const [corpusMetaData, dispatch] = useReducer<React.Reducer<CorpusMetaData, CorpusMetaDataActions>> (
        corpusMetaDataReducer, // a reducer function
        {
            projectTitle: {
                id: 0,
                project_name: ''
            },
            corpus: {
                id: 0,
                corpus_name: ''
            },
            files: []
        } // initial state
    )

    return (
        <CorpusContext.Provider value={corpusMetaData}>
            <CorpusDispatchContext.Provider value={dispatch}>
                {children}
            </CorpusDispatchContext.Provider>
        </CorpusContext.Provider>
    );
};

export const useCorpusMetaData = () => {
    return useContext(CorpusContext);
};

export const useCorpusDispatch = () => {
    return useContext(CorpusDispatchContext);
}