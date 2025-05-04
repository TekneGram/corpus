"use client"

// State management and context
import { useState } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

const WordCount = () => {

    const corpusMetadata = useCorpusMetaData();
    const corpusDispatch = useCorpusDispatch();
    console.log('corpusMetadata: ', corpusMetadata);

    return (
        <div className='word-count-container'>
            <div className='word-count-title'>Word Counts</div>
            <div className='word-count-corpus-container'> 
                <div className='word-count-corpus-header'>
                    <h2>{corpusMetadata.corpus.corpus_name} whole corpus</h2>
                </div>
                <div className='word-count-data-display'>
                    The data for the whole corpus will eventually be displayed here.
                </div>
            </div>
            <div className='word-count-subcorpus-container'>
                {
                    corpusMetadata.files.map(file => (
                        <div className='word-count-subcorpus-header' key={file.subCorpus.id}>
                            <h2>{file.subCorpus.group_name}</h2>
                            <div className='word-count-subcorpus-display'>
                                "The data for the subcorpus will eventually be displayed here."
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    );
};

export default WordCount;