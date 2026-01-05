declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                invoke(channel: string, ...args: any[]): Promise<any>;
                on(channel: string, listener: (...args: any[]) => void): void;
            };
            processFileContent: (fileContent: string) => Promise<any>;
            onFileProcessed: (callback: (result: string) => void) => void;
        };
    }
}

export {};