import { contextBridge } from "electron";
import { api } from "./preload/managerApi";
import { summarizerApi } from "./preload/summarizerApi";

console.log("[preload] LOADED", new Date().toISOString());



contextBridge.exposeInMainWorld('api', api);
contextBridge.exposeInMainWorld('summarizerApi', summarizerApi);
console.log("[preload] exposed api keys:", Object.keys(api));