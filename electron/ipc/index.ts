import { registerCorpusManagerIPC } from './corpusManager.ipc'
import { registerSummarizerIPC } from './summarizer.ipc'

export function registerIPC() {
    registerCorpusManagerIPC();
    registerSummarizerIPC();
}