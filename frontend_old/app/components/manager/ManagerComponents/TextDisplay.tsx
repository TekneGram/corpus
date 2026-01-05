// CSS
import '@/manager.css';

// Fonts
import { faPen, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Context and state management
import { useState, useEffect } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '../../../context/CorpusContext';

// Child components
import { toast } from 'react-toastify';

interface TextDisplayProps {
    fileID: number | null;
    setSelectedFileID: React.Dispatch<React.SetStateAction<number | null>>;
    fileText: string;
    setSelectedFileText: React.Dispatch<React.SetStateAction<string>>;
    showTextDisplay: boolean;
    setShowTextDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}

const TextDisplay: React.FC<TextDisplayProps> = (
    { fileID, 
        setSelectedFileID, 
        fileText, 
        setSelectedFileText, 
        showTextDisplay, 
        setShowTextDisplay 
    }) => {

    const [isRendered, setIsRendered] = useState<boolean>(false);
    useEffect(() => {
        if (showTextDisplay) {
            setTimeout(() => setIsRendered(true), 500);
        } else {
            setIsRendered(false);
        }
    }, [showTextDisplay]);

    /**
     * Hide the text display area
     */
    const handleHideTextDisplay = () => {
        setTimeout(() => {
            // Reset the file ID and text after the animation
            setSelectedFileID(null);
            setSelectedFileText("");
            setIsRendered(false);
            setShowTextDisplay(false);
        })
    }

    return (
        <div className={`transition-all duration-500 ease-in-out transform ${isRendered ? 'translate-y-0 opacity-100 max-h-96' : 'translate-y-full opacity-0 max-h-0'}`}>
            <div className='text-display-area'>
                <div className='text-display-header'>
                    <h2>Here is your lovely text</h2>
                    <div className='text-display-editor-area'>
                        <button type='button' className='text-edit-button'>
                            <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button type='button' className='text-hide-button' onClick={handleHideTextDisplay}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    </div>
                    
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
        </div>
        
    );
}

export default TextDisplay;