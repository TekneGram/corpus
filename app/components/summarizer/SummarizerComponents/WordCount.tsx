"use client"

// State management and context
import { useState, useEffect } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// API
import { checkCorpusFilesExistInDB, checkCorpusPreppedStatus } from '@/app/api/summarizeCorpus';

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
        // Check that file exist in the database
        const checkFilesAndCorpus = async () => {
            try {
                // First check: do the files exist in the database
                const filesExistResult = await checkCorpusFilesExistInDB(corpusMetadata.corpus.id);
                if (filesExistResult.status === "success") {
                    setFilesExistInDB(filesExistResult.cppOutput.hasFiles);
                    // Second check: is the corpus prepped and up to date?
                    const corpusPreppedCheckResult = await checkCorpusPreppedStatus(corpusMetadata.corpus.id, "countWords");
                    if (corpusPreppedCheckResult.status === "success") {

                        console.log("corpusPreppedStatus: ", corpusPreppedCheckResult);

                    } else {
                        // TODO
                        // handle the case when there is an error, e.g., toast message it
                    }
                } else {
                    // TODO
                    // handle the case when there is an error, e.g., toast message it
                }
                
                // if (result.status === "success") {
                //     setFilesExistInDB(true);

                //     // Second check: is the corpus prepped and up to date?
                //     const corpusResponse = await fetch(`http://localhost:4000/api/summarizer/project/${corpusMetadata.corpus.id}/corpus`, {
                //         method: "GET",
                //         headers: {
                //             'Content-Type': 'application/json'
                //         },
                //         credentials: 'include'
                //     });
                //     const corpusResult = await corpusResponse.json();
                //     console.log("This is the corpus data: ", corpusResult);

                //     if (corpusResult.data.analysisType === null && corpusResult.data.upToDate === null) {
                //         // In this case, the corpus is up to date but words have not been counted.
                //         // Give the user the option to count the words.
                //         setWordCountDataExistsInDB(false);
                //         setCountsUpToDateInDB(true);
                //     } else if (corpusResult.data.analysisType === "countWords" && corpusResult.data.upToDate === true) {
                //         // In this case, the corpus is up to date and words have been counted.
                //         setWordCountDataExistsInDB(true);
                //         setCountsUpToDateInDB(true);
                //         // We can continue to fetch the word count data from here.
                //         // TODO: Fetch the word count data from the API and display it.
                //     } else if (corpusResult.data.analysisType === "countWords" && corpusResult.data.upToDate === false) {
                //         // In this case, the corpus words have been counted, but the corpus has been updated, so the word count data is not up to date.
                //         // Give the user the option to update the word count data and / or display the current word count data.
                //         setWordCountDataExistsInDB(true);
                //         setCountsUpToDateInDB(false);
                //     }
                    
                // } else {
                //     setFilesExistInDB(false);
                // }  
            } catch (error) {
                console.error("Error running the corpus checks: ", error);
            }
        }
        checkFilesAndCorpus();
        

        // Get the word count data from the API
        
        const fetchWordCountData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusMetadata.corpus.id}/corpus/wordcount`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const result = await response.json();
                console.log("This is the word count data: ", result);
                if (result.status === "success") {
                    setWordCountData(result.data);
                    console.log(result.data);
                    setHasWordCountData(true);
                } else {
                    setHasWordCountData(false);
                }
            } catch (error) {
                console.error("Error fetching word count data: ", error);
            }
        }
        fetchWordCountData
    }, []);

    const handleSummarizeWords = async () => {
        console.log("Counting words...");
        try {
            const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusMetadata.corpus.id}/corpus/wordCount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const result = await response.json();
            console.log("This is the result of the word count operation: ", result);
        } catch (error) {
            console.error("Error counting words: ", error);
        }
    }

    return (
        <div className='word-count-container'>
            <div className='word-count-title'>Word Counts</div>
            <div className='word-count-operations-container'>
                <div className='word-count-operations-header'>
                    <button className='word-count-start-button' type='button' onClick={handleSummarizeWords}>Count words</button>
                </div>
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