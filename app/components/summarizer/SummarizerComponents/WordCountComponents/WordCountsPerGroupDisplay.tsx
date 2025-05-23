"use client"

// State management and context
import { useState, useEffect } from 'react';

// Types
import { WordCountsPerGroup } from '@/app/types/types';

// Interfaces
interface WordCountsPerGroupDisplayProps {
    wordCounts: WordCountsPerGroup
};


// CSS
import '@/styles/summarizer.css';

const WordCountsPerGroupDisplay: React.FC<WordCountsPerGroupDisplayProps> = ({ wordCounts }) => {

    const [showAll, setShowAll] = useState(false);
    const visibleRows = showAll ? wordCounts.groupWordCounts : wordCounts.groupWordCounts.slice(0, 5);

    return (
        <div className="word-counts-per-group-table-container">
            <h2 className="table-heading">Subcorpora</h2>
            <div className="table-wrapper">
                <table className="word-counts-table">
                    <thead>
                        <tr>
                            <th>Subcorpus</th>
                            <th>Token Count</th>
                            <th>Type Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleRows.map((group, index) => (
                            <tr key={index}>
                                <td>{group.groupName}</td>
                                <td>{group.tokenCount}</td>
                                <td>{group.typeCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {wordCounts.groupWordCounts.length > 5 && (
                <div className='toggle-button-container'>
                    <button className="toggle-button" onClick={() => setShowAll(!showAll)}>
                        { showAll ? 'Show Less ▲' : 'Show More ▼' }
                    </button>
                </div>
            )}
            </div>
        </div>
    );
}

export default WordCountsPerGroupDisplay;