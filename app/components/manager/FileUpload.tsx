// CSS
import '../../manager.css';

// APIs
import { tekneGramText } from '@/app/ipcRenderer/corpusEdits';

// Context and state management
import { useEffect, useState} from 'react';

interface FileUploadProps {

}

const FileUpload:React.FC<FileUploadProps> = ({ }) => {

    const [files, setFiles] = useState<File[]>([]);

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
                    className='file-uploader-button'
                    type='button'
                    onClick={processUploadedFiles}
                >
                    Add files
                </button>
            </div>
        
    );
};

export default FileUpload