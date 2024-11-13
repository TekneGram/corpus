import { toast } from 'react-toastify'

export const postCorpusName = async(corpusDetails: {}): Promise<any> => {
    try {
        const response = await fetch('http://localhost:4000/api/corpus-edits/corpus-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(corpusDetails)
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("There was an error updating the corpus name", error);
        toast.error("There was an error updating the corpus name: " + error);
    }
}

// should access a server!
export const tekneGramText = async(fileContent: {}): Promise<any> => {
    try {
        const response = await fetch('http://localhost:4000/api/corpus-edits/single-file', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(fileContent)
        })
        const data = await response.json();
        console.log(data);
        return data;
        
    } catch (error) {
        console.error("There was an error reading your file", error);
        toast.error("There was an error reading your file:" + error);
    }
}