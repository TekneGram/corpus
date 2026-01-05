import { useContext } from 'react';

import {
    CorpusContext,
    CorpusDispatchContext
} from './CorpusContext';

export const useCorpusMetaData = () => {
    return useContext(CorpusContext);
};

export const useCorpusDispatch = () => {
    return useContext(CorpusDispatchContext);
}