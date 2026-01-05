import '@styles/manager.css';

// views
import { CreateSubcorpusView } from './createAndEditSubcorpus/CreateSubcorpusView';

// hooks
import { useSubcorpusNameEditing } from './createAndEditSubcorpus/useSubcorpusNameEditing';
import { useFileUpload } from './fileHandlers/useFileUpload';

// context
import { useCorpusMetaData, useCorpusDispatch } from '@context/corpusMetadata/useCorpusMetadata'

// api
import { postGroupName, updateCorpusPreppedStatus } from '@app-api/manageCorpus';

// child components
import { toast } from 'react-toastify'

interface CreateSubcorpusProps {
    cancelAddNewSubcorpus: (state: void) => void;
}

const CreateSubcorpus:React.FC<CreateSubcorpusProps> = ({
    cancelAddNewSubcorpus
}) => {

    const { setSubcorpusName, subcorpusName, isValid } = useSubcorpusNameEditing('');
    const { files, isUploading, onFileChange, uploadFiles, resetFiles } = useFileUpload();

    const corpusMetadata = useCorpusMetaData();
    const corpusDispatch = useCorpusDispatch();

    const handleSubmit = async () => {
        try {
            const subCorpus = await postGroupName(
                subcorpusName,
                corpusMetadata.corpus
            );

            corpusDispatch({
                type: 'add-new-subcorpus',
                subCorpusName: subcorpusName,
                subCorpusId: subCorpus.id
            });

            const { successFiles, failedFiles } = await uploadFiles(subCorpus.id);

            successFiles.forEach(file =>
                corpusDispatch({
                    type: 'add-corpus-file',
                    subCorpusId: subCorpus.id,
                    corpusFile: file
                })
            );

            if (failedFiles.length > 0) {
                toast.warning(
                    "Some files failed to upload:\n" +
                    failedFiles.join("\n")
                );
            } else {
                toast.success("All files were successfully uploaded.");
                updateCorpusPreppedStatus(corpusMetadata.corpus.id)
            }

            resetFiles();
            cancelAddNewSubcorpus();

        } catch (err) {
            console.error(err);
            toast.error("Failed to create subcorpus");
            cancelAddNewSubcorpus()
        }
    }

    return(
        <CreateSubcorpusView 
            subcorpusName={subcorpusName}
            onNameChange={setSubcorpusName}
            onCancel={cancelAddNewSubcorpus}
            onFileChange={onFileChange}
            onSubmit={handleSubmit}
            canSubmit={isValid && files.length > 0 && !isUploading}
        />
    )
}

export default CreateSubcorpus;