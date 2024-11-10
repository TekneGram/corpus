const { app, ipcMain, BrowserWindow} = require('electron');
const path = require('path');
//const CreateDatabase = require('./database/createDatabase');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    mainWindow.loadURL('http://localhost:3000');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

const createDatabase = () => {
    CreateDatabase.createProjectTable();
    CreateDatabase.createCorpusTable();
    CreateDatabase.createGroupTable();
    CreateDatabase.createFilesTable();
    CreateDatabase.createWordsTable();
    CreateDatabase.createCollsTable();
    CreateDatabase.createThreeBunsTable();
    CreateDatabase.createFourBunsTable();
}

app.on('ready', () => {
    //createDatabase();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});