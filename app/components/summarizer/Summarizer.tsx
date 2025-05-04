"use client"

// CSS
import '../../globals.css';

// State management and context
import { useState } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// Child components
import TabsGeneralContainer from '../tabs/TabsGeneralContainer';

const Summarizer: React.FC = () => {

    const tabData = [
        { title: "Word Counter", content: <div>This tab is for counting words. </div> },
        { title: "Collocations", content: <div>This tab is for summarizing collocations. </div> },
        { title: "3-bundles", content: <div>This tab is for summarizing 3-word lexical bundles. </div> },
        { title: '4-bundles', content: <div> This tab is for summarizing 4-word lexical bundles. </div> }
    ];

    return (
        <TabsGeneralContainer tabs={tabData} />
    )
}

export default Summarizer;