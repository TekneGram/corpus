"use client"
// CSS
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

// Context and state management
import { useState, useEffect } from 'react';
import { ProjectTitlesProvider } from './context/ProjectsContext';
import { CorpusProvider } from './context/CorpusContext';

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
        <html lang="en">
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
      </ProjectTitlesProvider>
    </CorpusProvider>
    
  );
}
