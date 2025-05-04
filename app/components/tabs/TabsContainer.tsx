"use client"

// CSS
import '../../globals.css';

// Context and state management
import { useState } from 'react';

// Child components
import Tab from './Tab';
import Manager from '../manager/Manager';


const TabsContainer = () => {
    const [activeTab, setActiveTab] = useState<number>(1);
    const [tabTally, setTabTally] = useState<number[]>([1, 2, 3, 4]); // start with 4 tabs displayed

    const handleSetActiveTab = (tabNum: number) => {
        setActiveTab(tabNum);
    }

    return (
        <div>
            {/* Tab bar */}
            <div className='tabs-container'>
                {
                    tabTally.map((tally) => (
                        <div 
                            className='tab-container'
                            key={tally}
                        >
                                <Tab 
                                    tabNum={tally} 
                                    handleSetActiveTab={handleSetActiveTab} 
                                    activeTab={activeTab} 
                                />
                        </div>
                    ))
                }
            </div>
            {/* Tab Page Space */}
            <div className='tab-page-container'>
                {activeTab === 1 && <Manager />}
                {activeTab === 2 && <div>This tab is for summarizing the corpus.</div>}
                {activeTab === 3 && <div>This tab is for preparing corpus samples.</div>}
                {activeTab === 4 && <div>This tab is for performing analyses of the corpus ot samples.</div>}
            </div>
        </div>
        
    );
};

export default TabsContainer;