import { useState } from 'react';
import Tab from './Tab';

const TabsContainer = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [tabTally, setTabTally] = useState<number[]>([1, 2, 3, 4]); // start with 4 tabs displayed

    return (
        <div className='flex flex-col h-screen'>
            {
                tabTally.map((tally) => (
                    <Tab />
                ))
            }
        </div>
    );
};

export default TabsContainer;