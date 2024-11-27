"use client"

// CSS
import '../../manager.css';

// import types
import { CorpusFilesPerSubCorpus } from '@/app/types/types';

// APIs

// Context and State Management
import { useState, useEffect } from 'react';

// FileDisplayProps
interface FileDisplayProps {
    subCorpusFiles: CorpusFilesPerSubCorpus;
}


const FileDisplay:React.FC<FileDisplayProps> = ({ subCorpusFiles }) => {


    return (
        <div>
            <div className="group-name-display">
                {/* Subcorpus name area. Can click to change the name of the subcorpus */}
                {subCorpusFiles.subCorpus.group_name}
            </div>
            <div className="file-display-container">
                {/* Files display area. If a file is clicked, it displays the file text. */}
                {
                    subCorpusFiles.corpusFiles.map((corpusFile) => (
                        <div className="">

                            <div>{corpusFile.file_name}</div>

                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default FileDisplay;