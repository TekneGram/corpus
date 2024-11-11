import { useState } from 'react';
import Tab from './Tab';

const TabsContainer = () => {
    const [activeTab, setActiveTab] = useState<number>(1);
    const [tabTally, setTabTally] = useState<number[]>([1, 2, 3]); // start with 3 tabs displayed

    const handleSetActiveTab = (tabNum: number) => {
        setActiveTab(tabNum);
    }

    return (
        <div className='tabs-container'>
            {
                tabTally.map((tally) => (
                    <div 
                        className='tab-container'
                        key={tally}>
                            <Tab tabNum={tally} handleSetActiveTab={handleSetActiveTab} activeTab={activeTab} />
                    </div>
                ))
            }
        </div>
    );
};

export default TabsContainer;