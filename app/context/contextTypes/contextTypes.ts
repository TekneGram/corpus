import { SelectableProjectTitle, CorpusMetaData, CorpusFile } from "@/app/types/types";

export type ProjectTitlesActions = 
| { type: "initialize"; projectTitles: SelectableProjectTitle[] }
| { type: "sorted"; sortType: "asc" | "desc" }
| { type: "setSelected"; id: number }
| { type: "refreshed"; projectTitles: SelectableProjectTitle[]}

export type CorpusMetaDataActions = 
| { type: 'initialize'; corpusMetadata: CorpusMetaData }
| { type: 'update-corpus-name'; corpusName: string }
| { type: 'add-corpus-file'; subCorpusId: number; corpusFile: CorpusFile}
| { type: 'update-subcorpus-name'; subCorpusId: number; subCorpusName: string}
| { type: 'delete-file', subCorpusId: number; fileId: number}
| { type: 'reload-corpus-metadata'; corpusMetadata: CorpusMetaData};