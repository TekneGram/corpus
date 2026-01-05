"use client"

// State management and context
import { useState, useEffect } from 'react';
import { useCorpusMetaData } from '../../../../context/CorpusContext';

// CSS
import '@/styles/summarizer.css';

// Types
import { FileWordCounts, WordCountsPerFile, WordCountsPerGroup } from '../../../../types/types';

// Interfaces
interface WordCountsPerFilesDisplayProps {
    wordCountsPerFile: WordCountsPerFile;
    wordCountsPerGroup: WordCountsPerGroup;
}

type FileWordCountsWithGroupName = FileWordCounts & {
    groupName: string;
}


const WordCountsPerFileDisplay: React.FC<WordCountsPerFilesDisplayProps> = ({ wordCountsPerFile, wordCountsPerGroup }) => {
    
    if (!wordCountsPerFile?.fileWordCounts || !wordCountsPerGroup?.groupWordCounts) {
        return <div>Loading...</div>;
    }
    const [showAll, setShowAll] = useState(false);

    const updatedFileWordCounts: FileWordCountsWithGroupName[] = wordCountsPerFile.fileWordCounts.map((file) => {
        const group = wordCountsPerGroup.groupWordCounts.find(group => group.groupId === file.groupId);
        return {
            ... file,
            groupName: group ? group.groupName : 'Unknown'
        }
    });
    const visibleRows = showAll ? updatedFileWordCounts : updatedFileWordCounts.slice(0, 5);

    return (
        <div className="word-counts-per-file-table-container">
            <h2 className="table-heading">Word counts per file</h2>
            <div className="table-wrapper">
                <table className='word-counts-table'>
                    <thead>
                        <tr>
                            <th>File</th>
                            <th>Subcorpus</th>
                            <th>Token Count</th>
                            <th>Type Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleRows.map((file, index) => (
                            <tr key={index}>
                                <td>{file.fileName}</td>
                                <td>{file.groupName}</td>
                                <td>{file.tokenCount}</td>
                                <td>{file.typeCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {updatedFileWordCounts.length > 5 && (
                    <div className='toggle-button-container'>
                        <button className='toggle-button' onClick={(() => setShowAll(!showAll))}>
                            { showAll ? 'Show Less ▲' : 'Show More ▼' }
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WordCountsPerFileDisplay;