// CSS
import "@styles/globals.css"
import 'react-toastify/dist/ReactToastify.css'

// State Management and context
import { useState } from 'react';
import { ProjectTitlesProvider } from "@context/projectTitles/ProjectTitlesContext";
import { CorpusProvider } from '@context/corpusMetadata/CorpusContext';
import { SummaryProvider } from '@context/summaryMetadata/SummarizerContext';

// Layout components
import OperationsSidebar from "@components/layouts/OperationsSidebar";
import ProjectsSidebar from "@components/layouts/ProjectsSidebar";
import Header from "@components/layouts/Header";
import { ToastContainer } from "react-toastify";

type RootLayoutProps = {
    children: React.ReactNode;
}

export default function RootLayout({
    children,
}: RootLayoutProps) {
    const [isStartingNewProject, setIsStartingNewProject] = useState<boolean>(false)

    return (
        <CorpusProvider>
            <ProjectTitlesProvider>
                <SummaryProvider>
                    <div className="screen">
                        <ToastContainer />

                        <Header />

                        <div className="screen-body">
                            <OperationsSidebar 
                                handleStartingNewProject={setIsStartingNewProject}
                            />

                            <ProjectsSidebar
                                startingNewProject={isStartingNewProject}
                                handleStartingNewProject={setIsStartingNewProject}
                            />

                            <main className='main-area'>
                                {children}
                            </main>
                        </div>
                        

                    </div>
                </SummaryProvider>
            </ProjectTitlesProvider>
        </CorpusProvider>
    )
}