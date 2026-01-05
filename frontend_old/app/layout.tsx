"use client"
// CSS
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

// Context and state management
import { useState, useEffect } from 'react';
import { ProjectTitlesProvider } from './context/ProjectsContext';
import { CorpusProvider } from './context/CorpusContext';
import { SummaryProvider } from "./context/SummarizerContext";

// Child components
import OperationsSidebar from "./components/layouts/OperationsSidebar";
import ProjectsSidebar from "./components/layouts/ProjectsSidebar";
import Header from "./components/layouts/Header";
import { ToastContainer } from 'react-toastify';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isStartingNewProject, setIsStartingNewProject] = useState<boolean>(false);
  // const [projectTitles, setProjectTitles] = useState<ProjectTitle[]>([]);
  // // Get all the project titles on load
  // useEffect(() => {
  //   const handleLoadAllProjectTitles = async () => {
  //     const dbProjectTitles = await loadAllProjectTitles();
  //     setProjectTitles(dbProjectTitles);
  //   }
  //   handleLoadAllProjectTitles();
  // }, [loadAllProjectTitles, setProjectTitles]);
  

  return (
    <CorpusProvider>
      <ProjectTitlesProvider>
        <SummaryProvider>
          <html lang="en">
            <head>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Quattrocento:wght@400;700&display=swap" rel="stylesheet" />
            </head>
            <body
              className={`screen`}
            >
              <ToastContainer />
              
              <Header />

              <div className='screen-body'>

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

              
            </body>
          </html>
        </SummaryProvider>
      </ProjectTitlesProvider>
    </CorpusProvider>
    
  );
}
