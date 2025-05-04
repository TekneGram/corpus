"use client"

import '../../globals.css';
import { useState } from 'react';
import TabGeneral from './TabGeneral';

export interface TabsGeneralDefinition {
    title: string;
    content: React.ReactNode;
}

interface TabsGeneralContainerProps {
    tabs: TabsGeneralDefinition[];
}

const TabsGeneralContainer: React.FC<TabsGeneralContainerProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleSetActiveTab = (index: number) => {
        setActiveTab(index);
    }

    return (
        <div>
            {/* Tab bar */}
            <div className='tabs-container'>
                {
                    tabs.map((tab, index) => (
                        <div className='tabs-container' key={index}>
                            <TabGeneral 
                                title={tab.title}
                                tabNum={index}
                                handleSetActiveTab={handleSetActiveTab}
                                activeTab={activeTab}
                            />
                        </div>
                    ))
                }
            </div>

            {/* Tab content */}
            <div className='tab-page-container'>
                {tabs[activeTab]?.content}
            </div>
        </div>
    );
};

export default TabsGeneralContainer;