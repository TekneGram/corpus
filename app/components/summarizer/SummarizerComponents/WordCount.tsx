"use client"

// State management and context
import { useState, useEffect } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// CSS
import '@/styles/summarizer.css';

const WordCount = () => {

    const corpusMetadata = useCorpusMetaData();
    const corpusDispatch = useCorpusDispatch();
    
    
    const [hasWordCountData, setHasWordCountData] = useState<boolean>(false); // This will be used to track the existence of word count data.
    const [wordCountData, setWordCountData] = useState<any>(null); // TODO: Define the type of this data.

    useEffect(() => {
        // Get the word count data from the API
        // I only want to do this once when the component mounts.
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

    return (
        <div className='word-count-container'>
            <div className='word-count-title'>Word Counts</div>
            <div className='word-count-operations-container'>
                <div className='word-count-operations-header'>
                    <button className='word-count-start-button' type='button'>Count words</button>
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