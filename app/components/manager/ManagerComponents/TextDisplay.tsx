// CSS
import '@/manager.css';

// import APIs

import { getCorpusFileText } from '@/app/api/manageCorpus';

// Context and state management
import { useState } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// Child components
import { toast } from 'react-toastify';

const TextDisplay: React.FC = () => {

    return (
        <div className='text-display-area'>

        </div>
    );
}

export default TextDisplay;