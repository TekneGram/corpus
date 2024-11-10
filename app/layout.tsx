"use client"
import "./globals.css";

import OperationsSidebar from "./components/layouts/OperationsSidebar";
import ProjectsSidebar from "./components/layouts/ProjectsSidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`screen`}
      >
        <header className='page-header'>
            <h1>Header</h1>
        </header>

        <div className='screen-body'>

          <OperationsSidebar />
          <ProjectsSidebar />

          <main className='main-area'>
            {children}
          </main>

        </div>

        
      </body>
    </html>
  );
}
