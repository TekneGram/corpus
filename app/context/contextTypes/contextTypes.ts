import { SelectableProjectTitle, CorpusMetaData, CorpusFile } from "@/app/types/types";

export type ProjectTitlesActions = 
| { type: "initialize"; projectTitles: SelectableProjectTitle[] }
| { type: "sorted"; sortType: "asc" | "desc" }
| { type: "setSelected"; id: number }
| { type: "refreshed"; projectTitles: SelectableProjectTitle[]}
| { type: "update-project-title"; id: number; project_name: string }

export type CorpusMetaDataActions = 
| { type: 'initialize'; corpusMetadata: CorpusMetaData }
| { type: 'update-corpus-name'; corpusId: number; corpusName: string }
| { type: 'add-new-subcorpus'; subCorpusName: string; subCorpusId: number }
| { type: 'add-corpus-file'; subCorpusId: number; corpusFile: CorpusFile }
| { type: 'update-subcorpus-name'; subCorpusId: number; subCorpusName: string }
| { type: 'delete-file', subCorpusId: number; fileId: number }
| { type: 'delete-subcorpus', subCorpusId: number }