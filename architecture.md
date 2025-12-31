# TekneGram Architecture
This document describes the architecture of TekneGram

## Overall Architecture
- Electron app embedding Next.js for the front end and connecting to a node js back end.
- ./electron.js is the main entry point. When the app is app.on('ready' ... ) it creates a window with the title TekneGram, preloads ./electronPreload.js which sets up the ipcRenderer, and runs in localhost:3000. It also creates an sqlite database via the ./models/createDatabase.js file.

## ./app folder
This is the core folder for the front end
- layout.tsx is the entry point into the front end app
- page.tsx describes the front page, a child, of the layout. It contains the main components of the app.

### ./app/components
This folder contains the following folders
- layouts: contains Header.tsx, OperationsSidebar.tsx and ProjectsSidebar.tsx which provide three main views in the app
- tabs: contains TabsGeneralContainer.tsx and TabGeneral.tsx which provide tab views for switching between different screen views. These provide the main way to interact with content in the app.
