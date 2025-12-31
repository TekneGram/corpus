"use client"
// Types
import { WordCounts } from '@/app/types/types';

// State management and context
import { useState, useEffect } from 'react';
import { useCorpusMetaData } from '@/app/context/CorpusContext';
import { useSummaryContext, useSummaryDispatch } from '@/app/context/SummarizerContext';

// API
import { checkCorpusFilesExistInDB, checkCorpusPreppedStatus, fetchWordCountData, fetchWordListData, countWords, recountWords } from '@/app/api/summarizeCorpus';

// CSS
import '@/styles/summarizer.css';

// Components
import WordCountsPerFileDisplay from './WordCountComponents/WordCountsPerFileDisplay';
import WordCountsPerGroupDisplay from './WordCountComponents/WordCountsPerGroupDisplay';
import WordCountsPerCorpusDisplay from './WordCountComponents/WordCountsPerCorpusDisplay';

// WordList area
import WordList from './WordList';

const WordCount = () => {

    const corpusMetadata = useCorpusMetaData();
    const summaryMetadata = useSummaryContext();
    const summaryDispatch = useSummaryDispatch();

    
    const [filesExistInDB, setFilesExistInDB] = useState<boolean>(false);
    const [wordCountDataExistsInDB, setWordCountDataExistsInDB] = useState<boolean>(false);
    const [countsUpToDateInDB, setCountsUpToDateInDB] = useState<boolean | null>(false);
    const [hasWordCountData, setHasWordCountData] = useState<boolean>(false);

    const [showWordList, setShowWordList] = useState<boolean>(false);

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

                            if (analysis_type === null && up_to_date === null) {
                                setWordCountDataExistsInDB(false);
                                setCountsUpToDateInDB(true);
                                setHasWordCountData(false);
                            } else if (up_to_date === true && analysis_type === "countWords") {
                                setWordCountDataExistsInDB(true);
                                setCountsUpToDateInDB(true);
                                const wordCountsResults = await fetchWordCountData(corpusMetadata.corpus.id);
                                
                                if (wordCountsResults.status === "success") {
                                    summaryDispatch({type: 'update-word-counts', wordCounts: wordCountsResults.cppOutput });
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
        
    }, [corpusMetadata]);

    const handleSummarizeWords = async () => {
        console.log("Counting words...");
        const wordCounts = await countWords(corpusMetadata.corpus.id);
        if (wordCounts.status === "success") {
            setCountsUpToDateInDB(wordCounts.cppOutput.up_to_date);
            setHasWordCountData(true);
        }
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

    /**
     * TODO: Can maybe remove this and put it in the useEffect in WordList.tsx
     */
    const handleFetchWordListData = async () => {
        console.log("Getting the word list data");
        const wordLists = await fetchWordListData(corpusMetadata.corpus.id);
    }

    const handleSwitchView = () => {
        setShowWordList(!showWordList);
    }

    const renderWordCountDisplay = () => {
        console.log("wordCountDataExistsInDB: ", wordCountDataExistsInDB, "countsUpToDateInDB:", countsUpToDateInDB);
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
                    <div className='word-count-dashboard'>
                        <div className='to-word-lists'>
                            <button className='word-list-fetch-button' type='button' onClick={handleSwitchView}>Word Lists ➡</button>
                        </div>
                        <div className='word-count-corpus-subcorpus-container'>
                            <WordCountsPerCorpusDisplay wordCounts={summaryMetadata.summaryMetaData.wordCounts.wordCountsPerCorpus} />
                            <WordCountsPerGroupDisplay wordCounts={summaryMetadata.summaryMetaData.wordCounts.wordCountsPerGroup} />
                        </div>
                        <div className='word-count-files-container'>
                            <WordCountsPerFileDisplay wordCountsPerFile={summaryMetadata.summaryMetaData.wordCounts.wordCountsPerFile} wordCountsPerGroup={summaryMetadata.summaryMetaData.wordCounts.wordCountsPerGroup}/>
                        </div>
                        
                    </div>
                );
            } else {
                return (
                    <p>There seems to be some reason why your word counts are not displaying. The hasWordCountData state has not been updated properly. Not sure why!!!</p>
                )
            }
            
        }
    }

    return (
        <div className="word-count-container overflow-hidden">
            <div
                className={`flex transition-transform duration-500 ease-in-out`}
                style={{
                    width: "200%",
                    transform: showWordList ? "translateX(-50%)" : "translateX(0%)",
                }}
            >
                {/* Word Count View */}
                <div className="word-count-view">
                    <div className="word-count-title">Word Count View</div>
                    <div className="word-count-operations-container">
                        {filesExistInDB ? (
                            renderWordCountDisplay()
                        ) : (
                            <div className="no-files-in-db-message">
                                There are no files in your corpus. Add them in the Manage tab above.
                            </div>
                        )}
                    </div>
                </div>

                {/* Word List View */}
                <div className="word-count-view">
                    <div className="word-count-title">Word List View</div>
                    <div className='to-word-count'>
                            <button className='to-word-count-button' type='button' onClick={handleSwitchView}>🔙 Word Counts</button>
                        </div>
                <WordList />
                </div>
            
            </div>
        </div>
    );
};

export default WordCount;