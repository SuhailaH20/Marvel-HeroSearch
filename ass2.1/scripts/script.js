const publicKey = 'f0cb8f60cce8717140d1a2b63f8fd196';
const privateKey = '2afe5be7db48a888f7069c9fe1973ecde5e69cc3';

document.getElementById('input-box').addEventListener('input', function () {
    const userInput = this.value.trim();
    if (userInput !== '') {
        const timestamp = new Date().getTime();
        const hash = md5(timestamp + privateKey + publicKey);
        const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${userInput}&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayAutocomplete(data);
            })
            .catch(error => {
                console.error('Error fetching autocomplete data:', error);
            });
    } else {
        document.getElementById('autocomplete-list').innerHTML = '';
    }
});

function displayAutocomplete(data) {
    const characters = data.data.results;
    const autocompleteList = document.getElementById('autocomplete-list');

    if (characters.length > 0) {
        const autocompleteItems = characters.map(character => {
            return `<div class="autocomplete-item" onclick="selectHero('${character.name}')">${character.name}</div>`;
        }).join('');

        autocompleteList.innerHTML = autocompleteItems;
    } else {
        autocompleteList.innerHTML = '<div class="no-results">No matching heroes found.</div>';
        document.querySelector('.list').innerHTML = " ";
        document.querySelector('.display-container').innerHTML = " ";
        document.querySelector('.events-list').innerHTML = " ";
    }
}

function selectHero(name) {
    document.getElementById('input-box').value = name;
    document.getElementById('autocomplete-list').innerHTML = '';
}

//SEARCHING

document.getElementById('Submit-button').addEventListener('click', function () {
    fetchData();
    document.getElementById('autocomplete-list').innerHTML = '';
});

document.getElementById('input-box').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        fetchData();
        document.getElementById('autocomplete-list').innerHTML = '';
    }
});

function fetchData() {
    const userInput = document.getElementById('input-box').value.trim();
    const messageContainer = document.getElementById('show-container');
    if (userInput !== '') {

        const timestamp = new Date().getTime();
        const hash = md5(timestamp + privateKey + publicKey);
        const apiUrl = `https://gateway.marvel.com/v1/public/characters?name=${userInput}&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.data.results.length > 0) {
                    displayResults(data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                messageContainer.innerHTML = '<div class="error-message">Error fetching data. Please try again later.</div>';
            });
    } else {
        messageContainer.innerHTML = '<div class="error-message">Please enter a hero name.</div>';
        document.querySelector('.list').innerHTML = " ";
        document.querySelector('.events-list').innerHTML = " ";
    }
}
function displayResults(data) {
    const character = data.data.results[0];

    const characterInfo = `
        <h1>${character.name}</h1>
        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
        <p>${character.description || 'No description available.'}</p>
    `;

    document.getElementById('show-container').innerHTML = characterInfo;
    const comicsList = character.comics.items.slice(0, 5);
    const comicsInfo = `<h1>Comics:</h1><ul>${comicsList.map(comic => `<li>${comic.name}</li>`).join('') || 'No comic available.'}</ul>`;
    document.querySelector('.list').innerHTML = comicsInfo;
    fetchEvents(character.id);
}

function fetchEvents(characterId) {
    const ts = new Date().getTime();
    const hash = md5(`${ts}${privateKey}${publicKey}`);
    const apiUrl = `https://gateway.marvel.com/v1/public/characters/${characterId}/events?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayEvents(data))
        .catch(error => console.error("Error fetching character events:", error));
}

function displayEvents(data) {
    const characterEvents = data.data.results.slice(0, 5);

    if (characterEvents.length > 0) {
        const eventsInfo = `<h1>Events:</h1><ul>${characterEvents.map(event => `<li>${event.title}</li>`).join('')}</ul>`;
        document.querySelector('.events-list').innerHTML = eventsInfo;
    } else {
        document.querySelector('.events-list').innerHTML = 'No events available for this character.';
    }
}

