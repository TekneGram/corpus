"use client"

// State management and context
import { useState, useEffect } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// API
import { checkCorpusFilesExistInDB, checkCorpusPreppedStatus, fetchWordCountData, countWords } from '@/app/api/summarizeCorpus';

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
        

        // Get the word count data from the API
        
        // const fetchWordCountData = async () => {
        //     try {
        //         const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusMetadata.corpus.id}/corpus/wordcount`, {
        //             method: "GET",
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             credentials: 'include'
        //         });
        //         const result = await response.json();
        //         console.log("This is the word count data: ", result);
        //         if (result.status === "success") {
        //             setWordCountData(result.data);
        //             console.log(result.data);
        //             setHasWordCountData(true);
        //         } else {
        //             setHasWordCountData(false);
        //         }
        //     } catch (error) {
        //         console.error("Error fetching word count data: ", error);
        //     }
        // }
        // fetchWordCountData
    }, []);

    const handleSummarizeWords = async () => {
        console.log("Counting words...");
        const wordCounts = await countWords(corpusMetadata.corpus.id);
        console.log(wordCounts);
    }

    const handleFetchWordCountData = async () => {
        console.log("Getting the counted words...");
        const wordCounts = await fetchWordCountData(corpusMetadata.corpus.id);
        console.log(wordCounts);
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
                    <button className='word-count-start-button' type='button' onClick={handleSummarizeWords}>Recount the words</button>
                    <button className='word-count-fetch-button' type='button' onClick={handleFetchWordCountData}>Fetch data</button>
                </div>
            );
        }

        if (wordCountDataExistsInDB === true && countsUpToDateInDB === true) {
            return (
                <p>There will be a word count display component here soon!</p>
            );
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
            {/* What displays next should depend on whether counting data exists or not. */}
            {
                hasWordCountData ? (
                    <>
                        <div className='word-count-corpus-container'> 
                            <div className='word-count-corpus-header'>
                                <h2>{corpusMetadata.corpus.corpus_name} whole corpus</h2>
                            </div>
                            <div className='word-count-data-display'>
                                The word count for the whole corpus will eventually be displayed here. {wordCountData}
                            </div>
                        </div>
                        <div className='word-count-subcorpus-container'>
                            {
                                corpusMetadata.files.map(file => (
                                    <div className='word-count-subcorpus-header' key={file.subCorpus.id}>
                                        <h2>{file.subCorpus.group_name}</h2>
                                        <div className='word-count-subcorpus-display'>
                                            "The word count for the subcorpus will eventually be displayed here."
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                ) : (
                    <div className='word-count-data-display'>
                        No word count data exists for this corpus yet. Please click 'Count words' to generate the data.
                    </div>
                )
            }
            

        </div>
    );
};

export default WordCount;