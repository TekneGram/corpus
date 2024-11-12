import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../manager.css';


const Manager = () => {

    return (
        <div className = 'manager-container'>
            
            <div className = {`manage-group-area ${`lg:grid-cols-${4}`}`}>
                
                <div className = 'group-input-area add-group-area'>
                    <button
                        className='add-group-button'
                        type='button'
                    >
                        Add group
                        <FontAwesomeIcon icon={faPlus} />
                    </button>

                </div>
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
                    />
                    <button
                        className='file-uploader-button'
                        type='button'
                    >
                        Add files
                    </button>
                </div>
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
                    />
                    <button
                        className='file-uploader-button'
                        type='button'
                    >
                        Add files
                    </button>
                </div>
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
                    />
                    <button
                        className='file-uploader-button'
                        type='button'
                    >
                        Add files
                    </button>
                </div>
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
                    />
                    <button
                        className='file-uploader-button'
                        type='button'
                    >
                        Add files
                    </button>
                </div>
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
                    />
                    <button
                        className='file-uploader-button'
                        type='button'
                    >
                        Add files
                    </button>
                </div>
                
            </div>

            <div>
                <p>This is where you will see info</p>
                <p>Probably somewhere in the middle, related to your corpus</p>
            </div>
        </div>
    );
};

export default Manager;