import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileUpload from "./FileUpload";
import '../../manager.css';


const Manager = () => {

    return (
        <div className = 'manager-container'>
            
            <div className = {`manage-group-area ${``}`}>
                
                <div className = 'group-input-area add-group-area'>
                    <button
                        className='add-group-button'
                        type='button'
                    >
                        Add group
                        <FontAwesomeIcon icon={faPlus} />
                    </button>

                </div>
                <FileUpload />
                <FileUpload />
                <FileUpload />
                <FileUpload />
                
            </div>

            <div>
                <p>This is where you will see info</p>
                <p>Probably somewhere in the middle, related to your corpus</p>
            </div>
        </div>
    );
};

export default Manager;