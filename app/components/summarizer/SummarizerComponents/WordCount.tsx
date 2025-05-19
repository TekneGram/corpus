"use client"

// State management and context
import { useState, useEffect } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// API
import { checkCorpusFilesExistInDB, checkCorpusPreppedStatus, fetchWordCountData, fetchWordListData, countWords, recountWords } from '@/app/api/summarizeCorpus';

// CSS
import '@/styles/summarizer.css';

const WordCount = () => {

    const corpusMetadata = useCorpusMetaData();
    const corpusDispatch = useCorpusDispatch();

    
    const [filesExistInDB, setFilesExistInDB] = useState(false);
    const [wordCountDataExistsInDB, setWordCountDataExistsInDB] = useState(false);
    const [countsUpToDateInDB, setCountsUpToDateInDB] = useState(false);
    const [hasWordCountData, setHasWordCountData] = useState(false);
    const [wordCountData, setWordCountData] = useState(null);

    useEffect(() => {
        // Check that files exist in the database
        const checkFilesAndCorpus = async () => {
            try {
                const filesExistResult = await checkCorpusFilesExistInDB(corpusMetadata.corpus.id);
                if (filesExistResult.status === "success") {
                    const hasFiles = filesExistResult.cppOutput.has_files;
                    setFilesExistInDB(hasFiles);

                    if (hasFiles) {
                        const corpusPreppedCheckResult = await checkCorpusPreppedStatus(corpusMetadata.corpus.id, "countWords");
                        if (corpusPreppedCheckResult.status === "success") {
                            const { analysis_type, up_to_date } = corpusPreppedCheckResult.cppOutput;
                            console.log("analysisType: ", analysis_type, "upToDate: ", up_to_date);

                            if (analysis_type === undefined && up_to_date === undefined) {
                                setWordCountDataExistsInDB(false);
                                setCountsUpToDateInDB(true);
                                setHasWordCountData(false);
                            } else if (up_to_date === true && analysis_type === "countWords") {
                                setWordCountDataExistsInDB(true);
                                setCountsUpToDateInDB(true);
                                const wordCountsResults = await fetchWordCountData(corpusMetadata.corpus.id);
                                if (wordCountsResults.status === "success") {
                                    setWordCountData(wordCountsResults.cppOutput);
                                    setHasWordCountData(true);
                                } else {
                                    setHasWordCountData(false);
                                }
                            } else if (up_to_date === false && analysis_type === "countWords") {
                                setWordCountDataExistsInDB(true);
                                setCountsUpToDateInDB(false);
                                setHasWordCountData(false);
                            }
                        }
                    } else {
                        // There was a fail in the status when checking the corpus status
                        // handle with toast TODO
                    }
                } else {
                    // There was a fail in the status when checking whether the corpus has files
                    // handle with toast TODO
                }
            } catch (error) {
                console.error("Error running the corpus checks: ", error);
            }
        }
        checkFilesAndCorpus();
        
    }, []);

    const handleSummarizeWords = async () => {
        console.log("Counting words...");
        const wordCounts = await countWords(corpusMetadata.corpus.id);
        setCountsUpToDateInDB(wordCounts.up_to_date);
        setWordCountDataExistsInDB(true);
        console.log(wordCounts);
    }

    const handleRecountWords = async () => {
        console.log("Recounting the words...");
        const wordCounts = await recountWords(corpusMetadata.corpus.id);
        setCountsUpToDateInDB(wordCounts.up_to_date);
        setWordCountDataExistsInDB(true);
        console.log(wordCounts);
    }

    const handleFetchWordCountData = async () => {
        console.log("Getting the counted words...");
        const wordCounts = await fetchWordCountData(corpusMetadata.corpus.id);
        console.log(wordCounts);
    }

    const handleFetchWordListData = async () => {
        console.log("Getting the word list data");
        const wordLists = await fetchWordListData(corpusMetadata.corpus.id);
    }

    const renderWordCountDisplay = () => {
        if(wordCountDataExistsInDB === false && countsUpToDateInDB === true) {
            // Display the button to count the words
            return (
                <div className='word-count-operations-header'>
                    <button className='word-count-start-button' type='button' onClick={handleSummarizeWords}>Count words</button>
                </div>
            );
        }

        if (wordCountDataExistsInDB === true && countsUpToDateInDB === false) {
            // Give the option to fetch the current data or update the counts.
            return (
                <div className='word-count-operations-header'>
                    <p>Your corpus was recently updated.</p>
                    <button className='word-count-start-button' type='button' onClick={handleRecountWords}>Recount the words</button>
                    <button className='word-count-fetch-button' type='button' onClick={handleFetchWordCountData}>Fetch data</button>
                </div>
            );
        }

        if (wordCountDataExistsInDB === true && countsUpToDateInDB === true) {
            if (hasWordCountData === true) {
                return (
                    <>
                        <p>There will be a word count display component here soon!</p>
                        <p>Call the word lists if you like!</p>
                        <button className='word-list-fetch-button' type='button' onClick={handleFetchWordListData}>Get Word Lists</button>
                    </>
                );
            } else {
                return (
                    <p>There seems to be some reason why your word counts are not displaying. The hasWordCountData state has not been updated properly. Not sure why!!!</p>
                )
            }
            
        }
    }

    return (
        <div className='word-count-container'>
            <div className='word-count-title'>Word Counts</div>
            <div className='word-count-operations-container'>
                {
                    filesExistInDB ? (
                        // Files exist in the corpus database, so render counting and count display options
                        renderWordCountDisplay()
                    ) : (
                        // No files exist in the database
                        <div className='no-files-in-db-message'>There are no files in your corpus. Add them in the Manage tab above.</div>
                    )
                }
                
            </div>
            
            

        </div>
    );
};

export default WordCount;