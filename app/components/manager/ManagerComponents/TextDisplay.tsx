// CSS
import '@/manager.css';

// import APIs

import { getCorpusFileText } from '@/app/api/manageCorpus';

// Context and state management
import { useState } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// Child components
import { toast } from 'react-toastify';

interface TextDisplayProps {
    fileID: number | null;
    fileText: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ fileID, fileText }) => {

    return (
        <div className='text-display-area'>
            <div className='text-display-header'>
                <h2>Here is your lovely text</h2>
            </div>
            <div className='text-display-body'>
                {fileText.length > 0 ? (
                    <div className='text-display-text'>
                        {fileText}
                    </div>
                ) : (
                    <div className='text-display-text'>
                        No text available for this file.
                    </div>
                )}
            </div>
        </div>
    );
}

export default TextDisplay;