// CSS
import '@/manager.css';

// import APIs

import { getCorpusFileText } from '@/app/api/manageCorpus';

// Context and state management
import { useState, useEffect } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// Child components
import { toast } from 'react-toastify';

interface TextDisplayProps {
    fileID: number | null;
    fileText: string;
    showTextDisplay: boolean;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ fileID, fileText, showTextDisplay }) => {

    const [isRendered, setIsRendered] = useState<boolean>(false);
    useEffect(() => {
        if (showTextDisplay) {
            setTimeout(() => setIsRendered(true), 500);
        } else {
            setIsRendered(false);
        }
    }, [showTextDisplay]);

    return (
        <div className={'text-display-area bottom-0 left-0 transition-transform ' + (isRendered ? 'translate-y' : 'hidden translate-y-full')}>
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