// CSS
import '../../manager.css';

// APIs
import { tekneGramText } from '@/app/ipcRenderer/corpusEdits';
import { postGroupName } from '@/app/api/manageCorpus';

// Context and state management
import { useEffect, useState} from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

interface FileUploadProps {

}

const FileUpload:React.FC<FileUploadProps> = ({ }) => {

    const [files, setFiles] = useState<File[]>([]);
    const [subcorpusName, setSubcorpusName] = useState<string>('');
    const corpusMetadata = useCorpusMetaData();
    
    const handleGroupNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSubcorpusName(event.target.value);
    }

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            setFiles(Array.from(files));
        } else {
            setFiles([]);
        }
        // const fileReadPromises = Array.from(event.target.files || []).map((file) => {
        //     return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        //         const reader = new FileReader();
        //         reader.onload = () => resolve(reader.result);
        //         reader.onerror = reject;
        //         reader.readAsText(file);
        //     });
        // });
        
        // try {
        //     const contents = await Promise.all(fileReadPromises) as string[]; // casting will assert type safety
        //     setFileContents(contents);
        // } catch (error) {
        //     console.error("Error reading files:", error);
        // }

        // fileContents.forEach(file => console.log(file));
    };

    const processUploadedFiles = async () => {
        const results = [];
        // Process group name first and retrieve back the group_id
        const group_info = await postGroupName(subcorpusName, corpusMetadata.corpus);
        console.log('The file upload component says the group_info is: ', group_info);

        // Then process each file one at a time
        for (const file of files) {
            const fileContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                // reader.onload = () => {
                //     if (typeof reader.result === 'string') {
                //         reader.onload = () => resolve(reader.result as string);
                //     } else {
                //         reject(new Error('File content is not a string'));
                //     }
                // };
                reader.onerror = reject;
                reader.readAsText(file);
            });
            // Send the text to be processed by R and C++
            const result = await tekneGramText({fileContent: fileContent});
            results.push(result);
        }
    }

    return (
        
            <div className='group-input-area'>
                <input
                    className='group-name-input'
                    type='text' 
                    onChange={(e) => handleGroupNameChange(e)}
                    placeholder="Name subcorpus"
                    value={subcorpusName}
                />
                <input
                    type='file'
                    id='file-upload'
                    name='files'
                    multiple
                    accept='.txt'
                    className='file-chooser-button'
                    onChange={(e) => handleFileChange(e)}
                />
                <button
                    className={files.length > 0 && subcorpusName.length > 3 ? `file-uploader-button` : `file-uploader-button-disabled`}
                    type='button'
                    onClick={processUploadedFiles}
                    disabled={files.length === 0 && subcorpusName.length < 3}
                >
                    {
                        files.length > 0 && subcorpusName.length > 3 ? `Add files` : `Prepare name and files`
                    }
                </button>
            </div>
        
    );
};

export default FileUpload