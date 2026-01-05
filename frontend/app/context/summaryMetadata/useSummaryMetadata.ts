import { useContext } from 'react';

import {
    SummaryContext,
    SummaryDispatch
} from './SummarizerContext';

export function useSummaryContext() {
    return useContext(SummaryContext);
}

export function useSummaryDispatch() {
    return useContext(SummaryDispatch);
}