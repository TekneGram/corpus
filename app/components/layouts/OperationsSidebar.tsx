import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OperationsSidebar = () => {

    return (
        <aside className='operations-sidebar'>
            
            <button className='add-project-button'><FontAwesomeIcon icon={faPlus} /></button>
              
        </aside>
    );
}

export default OperationsSidebar;