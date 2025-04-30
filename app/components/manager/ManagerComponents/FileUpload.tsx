// CSS
import '../../../manager.css';

// import types
import { CorpusFile } from '@/app/types/types';

// APIs
import { postGroupName, uploadFileContent } from '@/app/api/manageCorpus';

// Context and state management
import { useEffect, useState} from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// Child components
import { toast } from 'react-toastify';

// Typeguards
import { isSubCorpus } from '@/app/types/typeguards';

interface FileUploadProps {
    cancelAddNewSubcorpus: (state:void) => void;
}

const FileUpload:React.FC<FileUploadProps> = ({ cancelAddNewSubcorpus }) => {

    const [files, setFiles] = useState<File[]>([]);
    const [subcorpusName, setSubcorpusName] = useState<string>('');
    const corpusMetadata = useCorpusMetaData();
    const corpusDispatch = useCorpusDispatch();
    
    const handleGroupNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSubcorpusName(event.target.value);
    }

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setFiles(Array.from(files));
        } else {
            setFiles([]);
        }
    };

    const processUploadedFiles = async () => {
        let results = [];
        // Process group name first and retrieve back the group_id
        const name_result = await postGroupName(subcorpusName, corpusMetadata.corpus);
        if (name_result.status === "success") {
            // Update the context state with the subcorpus name
            // Apply a typeguard here
            const subCorpusId = name_result.cppOutput.id;
            corpusDispatch({ type: 'add-new-subcorpus', subCorpusName: subcorpusName, subCorpusId: subCorpusId });

            // Then process each file one at a time
            for (const file of files) {
                console.log(file);
                const fileContent = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsText(file);
                });
                // Send the text to be processed by R and C++
                const result = await uploadFileContent(fileContent, subCorpusId, file.name);
                results.push(result);
            }
            console.log(results);

            let errorMessages = "";
            for (const result of results) {
                console.log(result);
                if(result.status === 'fail') {
                    errorMessages = errorMessages + result.cppOutput + "\n";
                }
                // Update the context
                corpusDispatch({ type: 'add-corpus-file', subCorpusId: subCorpusId, corpusFile: result.cppOutput as CorpusFile })
            }

            if (errorMessages === "") {
                toast.success("All files were successfully uploaded");
            } else {
                toast.warning("The following error messages were received: \n" + errorMessages);
            }
            // Update the context
            //confirmUploadSuccessful();
        } else {
            toast.error("There was an error creating your subcorpus");
        }
    }

    const handleCancelAddNewSubcorpus = () => {
        cancelAddNewSubcorpus();
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
                <button
                    className='cancel-add-files'
                    type='button'
                    onClick={handleCancelAddNewSubcorpus}
                >
                    Cancel
                </button>
            </div>
        
    );
};

export default FileUpload