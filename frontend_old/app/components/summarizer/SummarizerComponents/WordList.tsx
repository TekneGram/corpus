"use client"

// State management and context
import { useEffect, useState } from 'react';

// API
import { fetchWordListData } from '../../../api/summarizeCorpus';

// CSS
import '@/styles/summarizer.css';

// Components
import WordListPerCorpus from './WordListComponents/WordListPerCorpus';
import WordListPerGroup from './WordListComponents/WordListPerGroup';
import WordListPerFile from './WordListComponents/WordListPerFile';

const WordList = () => {

    return(
        <>
            <p>I am the word list area!</p>
        </>
    )
}

export default WordList;