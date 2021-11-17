import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderItem from './HeaderItem';
import WordItem from './WordItem';
import {useState, useRef} from 'react';

function RhymeFinder() {

    function groupBy(objects, property) {
        // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
        // value for property (obj[property])
        if(typeof property !== 'function') {
            const propName = property;
            property = (obj) => obj[propName];
        }

        const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
        for(const object of objects) {
            const groupName = property(object);
            //Make sure that the group exists
            if(!groupedObjects.has(groupName)) {
                groupedObjects.set(groupName, []);
            }
            groupedObjects.get(groupName).push(object);
        }

        // Create an object with the results. Sort the keys so that they are in a sensible "order"
        const result = {};
        for(const key of Array.from(groupedObjects.keys()).sort()) {
            result[key] = groupedObjects.get(key);
        }
        return result;
    }

    const inputEl = useRef(null);
    const [savedWords, setSavedWords] = useState([]);
    const [outputDescription, setOutDescription] = useState('');
    const [output, setOutput] = useState('');

    function saveWord(word) {
        setSavedWords(saved => saved.concat(word));
    }

    function onKeydown(event) {
        if(event.key === 'Enter') {
            getWords(true);
        }
    }

    async function getWords(isRhyme) {
        let currentOutputDescription = isRhyme ? `Words that rhyme with ${inputEl.current.value}: `
        : `Words with a meaning similar to ${inputEl.current.value}: `;
        setOutDescription(currentOutputDescription);
        let url = 'https://api.datamuse.com/words?';
        url = isRhyme ? url + 'rel_rhy='+inputEl.current.value : url + 'ml='+inputEl.current.value;
        setOutput('...loading');
        try {
            const response = await fetch(url);
            const data = await response.json();
            setOutput('');
            if(data.length > 0) {
                const currentOutput = [];
                if(isRhyme) {
                    const groups = groupBy(data, 'numSyllables');
                    for(const group in groups) {
                        currentOutput.push(<HeaderItem key={group} text={group}/>);
                        currentOutput.push(groups[group].map((item) => <WordItem key={item.word} word={item.word} onClick={() => saveWord(item.word)} /> ))
                    }
                    setOutput(currentOutput);
                }
                else {
                    currentOutput.push(data.map((item) => <WordItem key={item.word} word={item.word} onClick={() => saveWord(item.word)}/> ))
                    setOutput(currentOutput);
                }
            }
            else {
                setOutput('(no results)');
            }
        } catch (error) {
            setOutDescription("Failed to fetch from Datamuse API.");
        }
    }

    return <div>
        <main className="container">
            <h1 className="row">Rhyme Finder (579 Problem Set 6)</h1>
            <div className="row">
                <div className="col">
                    <a href='https://github.com/clebioda/si579-ps6'>Link to Github</a>
                </div>
            </div>
            <div className="row">
                <div className="col">Saved words: <span id="saved_words">{savedWords.length ? savedWords.join(', ') : '(none)'}</span></div>
            </div>
            <div className="row">
                <div className="input-group col">
                    <input ref={inputEl} onKeyDown={onKeydown} className="form-control" type="text" placeholder="Enter a word" id="word_input" />
                    <button onClick={() => getWords(true)} id="show_rhymes" type="button" className="btn btn-primary">Show rhyming words</button>
                    <button onClick={() => getWords(false)} id="show_synonyms" type="button" className="btn btn-secondary">Show synonyms</button>
                </div>
            </div>
            <div className="row">
                <h2 className="col" id="output_description">{outputDescription}</h2>
            </div>
            <div className="output row">
                <output id = "word_output" className="col">{output}</output>
            </div>
        </main>
    </div>;
}

export default RhymeFinder;