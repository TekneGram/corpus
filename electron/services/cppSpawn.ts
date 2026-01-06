import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { app } from "electron";

type RunCallback = (error: Error | null, output: string | null) => void;

class CPPProcess {
    private cppProcess: ChildProcessWithoutNullStreams;
    private cppOutput: string;
    private cppErrorOutput: string;

    constructor(executable: string) {
        const resolvedPath = this.resolveExecutablePath(executable);

        console.log("Resolved C++ executable path:", resolvedPath);

        const dbPath = process.env.CORPUS_DB_PATH;
        const args = dbPath ? ["--db", dbPath] : []

        this.cppProcess = spawn(resolvedPath, args, {
            stdio: ["pipe", "pipe", "pipe"],
            windowsHide: true,
            env: process.env
        });

        this.cppOutput = "";
        this.cppErrorOutput = "";

        this.cppProcess.on("error", (err: Error) => {
            console.error("Failed to start C++ executable", err);
            this.sendErrorInExecutable();
        });
    }

    runProcess(jsonData: string, callback: RunCallback): void {
        this.writeDataToProcess(jsonData);
        this.collectOutput(callback);
    }

    getProcessOutput(): string {
        return this.cppOutput;
    }

    getProcessErrors(): string {
        return this.cppErrorOutput;
    }

    // --------------------
    // private helpers
    // --------------------

    private getPlatformDir(): "mac" | "windows" | "linux" {
        switch (process.platform) {
            case "darwin":
                return "mac";
            case "win32":
                return "windows";
            case "linux":
                return "linux"
            default:
                // Implies a new/unsupported platform
                throw new Error(`Unsupported platform: ${process.platform}`);
        }
    }

    private resolveExecutablePath(executable: string): string {
        const exeName = process.platform === "win32" ? `${executable}.exe` : executable;

        const baseDir = app.isPackaged
        ? path.join(process.resourcesPath, "bin", "executables")
        : path.join(process.cwd(), "electron", "bin", "executables");

        const platformDir = this.getPlatformDir();

        // New layout: executables/<platform>/<exeName>
        const platformPath = path.join(baseDir, platformDir, exeName);

        // Legacy layout: executables/<exeName>
        const legacyPath = path.join(baseDir, exeName);

        // Prefer new layout; fallback to legacy to transition safely.
        if (fs.existsSync(platformPath)) return platformPath;
        if (fs.existsSync(legacyPath)) return legacyPath;

        // If neither exists, throw a useful error
        throw new Error(
            `C++ executable not found.\nTried:\n  ${platformPath}\n  ${legacyPath}`
        );
    }

    private writeDataToProcess(jsonData: string): void {
        this.cppProcess.stdin.write(jsonData + "\n", "utf8");
        this.cppProcess.stdin.end();
    }

    private sendErrorInExecutable(): number {
        // Keeps your original intent/semantics
        return 1;
    }

    private collectOutput(callback: RunCallback): void {
        this.cppProcess.stdout.on("data", (data: Buffer) => {
            this.cppOutput += data.toString("utf8");
        });

        this.cppProcess.stderr.on("data", (data: Buffer) => {
            this.cppErrorOutput += data.toString("utf8");
        });

        this.cppProcess.on("close", (code: number | null) => {
            if (code === 0) {
                console.log("C++ process completed successfully");
                callback(null, this.cppOutput);
            } else {
                console.log("Could not complete process");
                const errorMsg =
                    this.cppErrorOutput ||
                    `C++ process exited with code ${code} and no error output.`;
                callback(new Error(errorMsg), null);
            }
        });
    }
}

export default CPPProcess;
