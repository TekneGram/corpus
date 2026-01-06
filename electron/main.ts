import { app, BrowserWindow } from "electron";
import path from "path";
import { registerIPC } from "./ipc"
import fs from "fs"

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    },
  });

  if (app.isPackaged) {
    // =====================
    // PROD
    // =====================
    mainWindow.loadFile(
      path.join(__dirname, "../index.html")
    );
  } else {
    // =====================
    // DEV
    // =====================
    mainWindow.loadURL("http://localhost:5173");
    // mainWindow.loadFile(
    //   path.join(__dirname, "../index.html")
    // );

    // later:
    // mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  }
}



// ============
// DATABASE
// ============
function ensureRuntimeDatabase() : string {
  const runtimeDir = path.join(app.getPath("userData"), "database");
  const runtimeDb = path.join(runtimeDir, "corpus.sqlite")

  const seedDb = app.isPackaged
    ? path.join(process.resourcesPath, "bin", "database", "corpus.sqlite")
    : path.join(process.cwd(), "electron", "bin", "database", "corpus.sqlite");

  fs.mkdirSync(runtimeDir, { recursive: true })

  if (!fs.existsSync(runtimeDb)) {
    fs.copyFileSync(seedDb, runtimeDb);
  }

  return runtimeDb;
}


app.whenReady().then(() => {
    // Create the database
    const dbPath = ensureRuntimeDatabase();
    process.env.CORPUS_DB_PATH = dbPath;
    
    // Register IPC for data transfers
    registerIPC();

    // Get the front end ready
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});