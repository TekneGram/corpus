"use client"
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

import OperationsSidebar from "./components/layouts/OperationsSidebar";
import ProjectsSidebar from "./components/layouts/ProjectsSidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isStartingNewProject, setIsStartingNewProject] = useState<boolean>(false);

  return (
    <html lang="en">
      <body
        className={`screen`}
      >
        <ToastContainer />
        <header className='page-header'>
            <h1>Header</h1>
        </header>

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
  );
}
