// State management and context
import { useState, useEffect } from 'react';

// CSS
import '@styles/summarizer.css';

// Types
import { WordCountsPerCorpus } from '@shared/types/manageCorpusTypes';

// Interfaces
interface WordCountsPerCorpusDisplayProps {
    wordCounts: WordCountsPerCorpus;
}


const WordCountsPerCorpusDisplay: React.FC<WordCountsPerCorpusDisplayProps> = ({ wordCounts }) => {

    return (
        <div className="word-counts-per-corpus-table-container">
            <h2 className="table-heading">Corpus</h2>
            <div className="table-wrapper">
                <table className="word-counts-table">
                    <thead>
                        <tr>
                            <th>Token Count</th>
                            <th>Type Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{wordCounts.tokenCount}</td>
                            <td>{wordCounts.typeCount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default WordCountsPerCorpusDisplay;