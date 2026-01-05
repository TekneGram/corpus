import { Corpus, SubCorpus } from "./types";

export const isCorpus = (output: unknown): output is Corpus => {
    return typeof output === 'object' && output !== null && 'id' in output;
}

export const isSubCorpus = (output: unknown): output is SubCorpus => {
    return typeof output === 'object' && output !== null && 'id' in output && 'group_name' in output;
}