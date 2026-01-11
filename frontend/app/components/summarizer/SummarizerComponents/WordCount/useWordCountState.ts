import { checkCorpusFilesExistInDB } from "@/api/summarizeCorpus";
import { useSummaryDispatch } from "@/context/summaryMetadata/useSummaryMetadata";
import { useState, useEffect } from 'react';

export function useWordCountState(corpusId: number) {
    const summaryDispatch = useSummaryDispatch();

    const [filesExist, setFilesExist] = useState<boolean>(false);
    const [dataExists, setDataExists] = useState<boolean>(false);
    const [upToDate, setUpToDate] = useState<boolean | null>(null)
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function init() {
            const files = await checkCorpusFilesExistInDB(corpusId);
            if (cancelled) return;

            // To complete
        }

        init();
        return () => {
            cancelled = true;
        };
    }, [corpusId, summaryDispatch]);

    return {
        filesExist,
        dataExists,
        upToDate,
        hasData
    };
}