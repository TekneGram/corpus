"use client"
import "./globals.css";

import { useState, useRef } from 'react';
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const [projectsBarWidth, setProjectsBarWidth] = useState(300);
  const isDragging = useRef(false); // Keeps its value between renders

  const handleChangeWidth = () => {
    isDragging.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current) {
      setProjectsBarWidth((prevWidth) => Math.max(prevWidth + e.movementX, 150));
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <html lang="en">
      <body
        className={`screen`}
      >
        <header className='page-header'>
            <h1>Header</h1>
        </header>

        <div className='screen-body'>

          <aside className='operations-sidebar'>
            
            <button className='add-project-button'><FontAwesomeIcon icon={faPlus} /></button>
              
          </aside>

          <aside className='projects-sidebar' style = {{ width: projectsBarWidth }}>
            <h2>Projects</h2>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </aside>

          {/* For resizing the sidebar */}
          <div className='divider' onMouseDown={handleChangeWidth}>

          </div>

          <main className='main-area'>
            {children}
          </main>

        </div>

        
      </body>
    </html>
  );
}
