import { toast } from 'react-toastify'

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