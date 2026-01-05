
// types
import type { CorpusFile, CorpusFilesPerSubCorpus } from '@shared/types/manageCorpusTypes';

// views
import { SubcorpusDisplayView } from './createAndEditSubcorpus/SubcorpusDisplayView';

// hooks
import { useSubcorpusNameEditing } from './createAndEditSubcorpus/useSubcorpusNameEditing';
import { useFileUpload } from './fileHandlers/useFileUpload';

 // context
 import { useCorpusDispatch } from '@/context/corpusMetadata/useCorpusMetadata';

// api
import { patchGroupName } from '@/api/manageCorpus';

// child components
import { toast } from 'react-toastify';

interface SubcorpusDisplayProps {
    subCorpusFiles: CorpusFilesPerSubCorpus;
    showTextWithFileID: (fileId: number) => void; // From the parent component to allow displaying text from a selected file.
}

const SubcorpusDisplay:React.FC<SubcorpusDisplayProps> = ({
    subCorpusFiles,
    showTextWithFileID
}) =>  {

    const { setSubcorpusName, subcorpusName, isValid, startEditing, cancelEditing, commitEditing } = useSubcorpusNameEditing(subCorpusFiles.subCorpus.group_name);
    const corpusDispatch = useCorpusDispatch();

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

    return (
        <SubcorpusDisplayView
            subCorpusFiles={subCorpusFiles}
            subcorpusName={subcorpusName}
            onNameChange={setSubcorpusName}
            canSubmitNameChange={isValid}
            onSubmitNameChange={handleNameChangeSubmit}
            onCancelNameChange={handleNameChangeCancel}
        />
    )
};

export default SubcorpusDisplay;