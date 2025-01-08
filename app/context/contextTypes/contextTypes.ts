import { SelectableProjectTitle, CorpusMetaData } from "@/app/types/types";

export type ProjectTitlesActions = 
| { type: "initialize"; projectTitles: SelectableProjectTitle[] }
| { type: "sorted"; sortType: "asc" | "desc" }
| { type: "setSelected"; id: number }
| { type: "refreshed"; projectTitles: SelectableProjectTitle[]}

export type CorpusMetaDataActions = 
| { type: 'initialize'; corpusMetadata: CorpusMetaData }
| { type: 'update-corpus-name'; corpusName: string }
| { type: 'reload-corpus-metadata'; corpusMetadata: CorpusMetaData};