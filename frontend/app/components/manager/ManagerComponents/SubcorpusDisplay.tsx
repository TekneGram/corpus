
// types
import type { CorpusFile, CorpusFilesPerSubCorpus, FileUploadResult } from '@shared/types/manageCorpusTypes';

// views
import { SubcorpusDisplayView } from './createAndEditSubcorpus/SubcorpusDisplayView';

// hooks
import { useSubcorpusNameEditing } from './createAndEditSubcorpus/useSubcorpusNameEditing';
import { useFileUpload } from './fileHandlers/useFileUpload';

// effects
import { useEffect } from 'react';

 // context
 import { useCorpusDispatch, useCorpusMetaData } from '@/context/corpusMetadata/useCorpusMetadata';

// api
import { patchGroupName, updateCorpusPreppedStatus } from '@/api/manageCorpus';

// child components
import { toast } from 'react-toastify';

interface SubcorpusDisplayProps {
    subCorpusFiles: CorpusFilesPerSubCorpus;
    showTextWithFileID: (fileId: number) => void; // From the parent component to allow displaying text from a selected file.
    selectedFileID: number | null;
}

const SubcorpusDisplay:React.FC<SubcorpusDisplayProps> = ({
    subCorpusFiles,
    showTextWithFileID,
    selectedFileID
}) =>  {

    const { setSubcorpusName, subcorpusName, isValid, cancelEditing, commitEditing } = useSubcorpusNameEditing(subCorpusFiles.subCorpus.group_name);
    const { files, isUploading, error: fileError, onFileChange, uploadFiles, resetFiles, deleteFile } = useFileUpload();
    const corpusDispatch = useCorpusDispatch();
    const corpusMetadata = useCorpusMetaData();

    // Handles the error from useFileUpload hook.
    useEffect(() => {
        if (!fileError) return;

        if(fileError.type === 'partial') {
            toast.warning(
                'Some files failed to upload:\n' +
                fileError.failedFiles.join('\n')
            );
        } else {
            toast.error(fileError.message);
        }
    }, [fileError]);

    const handleNameChangeSubmit = async () => {
        try {
            const result = await patchGroupName(subcorpusName, subCorpusFiles.subCorpus.id);
            corpusDispatch({
                type: 'update-subcorpus-name',
                subCorpusId: result.id,
                subCorpusName: result.group_name
            });
            toast.success(`Successfully updated the subcorpus name to ${subcorpusName}`);
            commitEditing()
        } catch (err) {
            console.error(err);
            cancelEditing();
        }
    }

    const handleNameChangeCancel = () => {
        cancelEditing();
    }

    const handleSubmitFiles = async () => {
        const { successFiles, failedFiles } = await uploadFiles(subCorpusFiles.subCorpus.id);
        
        successFiles.forEach(file =>
            corpusDispatch({
                type: 'add-corpus-file',
                subCorpusId: subCorpusFiles.subCorpus.id,
                corpusFile: file
            })
        );

        if (successFiles.length > 0 && failedFiles.length === 0) {
            toast.success('All files were successfully uploaded.');
            updateCorpusPreppedStatus(corpusMetadata.corpus.id);
        }

        resetFiles();
    }

    const handleSubmitDeleteFile = async (fileId) => {
        const result = await deleteFile(fileId);
        if (result.success === true) {
            toast.success(result.message);
            corpusDispatch({
                type: 'delete-file',
                subCorpusId: subCorpusFiles.subCorpus.id,
                fileId: fileId
            });

            if (result.groupDeleted === true) {
                corpusDispatch({
                    type: 'delete-subcorpus',
                    subCorpusId: subCorpusFiles.subCorpus.id
                });
            }

            updateCorpusPreppedStatus(corpusMetadata.corpus.id);
            showTextWithFileID(null);
        } else {
            toast.error(result.message);
        }
    }

    return (
        <SubcorpusDisplayView
            subCorpusFiles={subCorpusFiles}
            subcorpusName={subcorpusName}
            onNameChange={setSubcorpusName}
            canSubmitNameChange={isValid}
            onSubmitNameChange={handleNameChangeSubmit}
            onCancelNameChange={handleNameChangeCancel}
            onFileChange={onFileChange}
            canSubmitFiles={files.length > 0 && !isUploading}
            onSubmitFiles={handleSubmitFiles}
            selectedFileID={selectedFileID}
            setSelectedFile={showTextWithFileID}
            onSubmitDeleteFile={handleSubmitDeleteFile}
        />
    )
};

export default SubcorpusDisplay;