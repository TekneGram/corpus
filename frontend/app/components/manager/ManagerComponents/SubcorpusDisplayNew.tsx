
// types
import type { CorpusFile, CorpusFilesPerSubCorpus, FileUploadResult } from '@shared/types/manageCorpusTypes';

// views
import { SubcorpusDisplayView } from './createAndEditSubcorpus/SubcorpusDisplayView';

// hooks
import { useSubcorpusNameEditing } from './createAndEditSubcorpus/useSubcorpusNameEditing';
import { useFileUpload } from './fileHandlers/useFileUpload';

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
    const { files, isUploading, onFileChange, uploadFiles, resetFiles } = useFileUpload();
    const corpusDispatch = useCorpusDispatch();
    const corpusMetadata = useCorpusMetaData();

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
        try {
            const { successFiles, failedFiles }: FileUploadResult = await uploadFiles(subCorpusFiles.subCorpus.id);
            successFiles.forEach(file =>
                corpusDispatch({
                    type: 'add-corpus-file',
                    subCorpusId: subCorpusFiles.subCorpus.id,
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
                updateCorpusPreppedStatus(corpusMetadata.corpus.id);
            }

            resetFiles();
        } catch (err) {
            console.error("Failed to add files: ", err);
            toast.error("Failed to add files.");
        }
    }

    const handleSubmitDeleteFile = async () => {

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