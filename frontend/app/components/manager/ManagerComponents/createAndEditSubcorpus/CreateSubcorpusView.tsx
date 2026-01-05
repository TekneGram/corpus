import '@styles/manager.css';

interface CreateSubcorpusViewProps {
    subcorpusName: string;
    onNameChange: (value: string) => void;
    onCancel: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    canSubmit: boolean;
}

export const CreateSubcorpusView: React.FC<CreateSubcorpusViewProps> = ({
    subcorpusName,
    onNameChange,
    onCancel,
    onFileChange,
    onSubmit,
    canSubmit
}) => (
    <>
        <div className="group-input-area">
            <input
                className="group-name-input"
                type="text"
                value={subcorpusName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Name subcorpus"
            />
            <input
                type='file'
                id='file-upload'
                name='files'
                multiple
                accept='.txt'
                className='file-chooser-button'
                onChange={onFileChange}
            />

            <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className={canSubmit ? `file-uploader-button` : `file-uploader-button-disabled`}
            >
                {
                    canSubmit ? `Add files` : `Prepare files and subcorpus name first`
                }
            </button>

            <button
                className='cancel-add-files'
                type='button'
                onClick={onCancel}
            >
                Cancel
            </button>
        </div>
    </>
)