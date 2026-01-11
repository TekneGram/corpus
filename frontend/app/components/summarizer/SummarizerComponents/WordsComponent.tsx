import { useCorpusMetaData } from "@/context/corpusMetadata/useCorpusMetadata"

import { useState } from 'react';
import { useWordCountState } from "./WordCount/useWordCountState";


const WordsComponent = () => {
    const corpusId = useCorpusMetaData().corpus.id;
    const [showWordList, setShowWordList] = useState(false);

    const state = useWordCountState(corpusId);
    //const actions = useWordCountActions(corpusId);

    const toggleSwitchView = () => {
        setShowWordList(!showWordList);
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
                        <WordCountView
                            status={status}
                            actions={actions}
                            onShowWordList={() => toggleSwitchView()}
                        />
                    </div>
                </div>

                {/* Word List View */}
                <div className="word-count-view">
                    <div className="word-count-title">Word List View</div>
                    <div className='to-word-count'>
                        <button className='to-word-count-button' type='button' onClick={toggleSwitchView}>🔙 Word Counts</button>
                    </div>
                    <WordListView />
                </div>
            
            </div>
        </div>
    )
}