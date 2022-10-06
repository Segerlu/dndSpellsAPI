let resultsCanvas = document.getElementById('results');
let searchInput = document.getElementById('searchField');
let searchButton = document.getElementById('searchButton');
let updateOldName = document.getElementById('oldname');
let updateNewName = document.getElementById('newname');
let newSpellName = document.getElementById('name');
let baseUrl = 'http://localhost:8006/spells'
let selected;

resultsCanvas.addEventListener('mousedown', e => {
    let spell = e.target;
    if(e.target.classList.contains('result-card')) {

        selected = spell.firstChild.textContent;

        for (let i = 0; i < resultsCanvas.childNodes.length; i++) {
            resultsCanvas.childNodes[i].style.border = 'solid black 2px'
        }
        spell.style.border = 'solid black 10px'

            //deleteSpell(spell);
    }
})

async function loadAllSpells() {

    let url = baseUrl;
    let response = await fetch(url);
    let data = await response.json();

    emptyResults()
    data.map(spell => {
      createResultCard(spell, resultsCanvas);  
    })
}

async function searchSpells() {
    let url = baseUrl + '/name/' + searchInput.value;
    if (searchInput.value === "") {
        loadAllSpells();
        return;
    } 
    let response = await fetch(url);
    let data = await response.json();
    
    searchInput.value = "";
    emptyResults()
    data.map(spell => {
      createResultCard(spell, resultsCanvas);  
    })
}

async function addSpell() {

    let url = baseUrl;
    let index = newSpellName.value.replace(' ', '-');
    let name = newSpellName.value;
    let spellUrl = '/api/spells/' + newSpellName.value;

    let content = `[{"index":"${index}","name":"${name}","url":"${spellUrl}"}]`;
    console.log(content)
    let response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    })
    .then(data => {
        resultsCanvas.append("new spell created")
        //createResultCard(data.json(), resultsCanvas)
    })
}

async function updateSpells() {

    let url = baseUrl + '/update/' + updateOldName.value + '/' + updateNewName.value;
    url = url.replace(' ', '+')

    let response = await fetch(url);
    let data = await response.json();

    emptyResults()
    resultsCanvas.append(JSON.stringify(data))

      //createResultCard(data, resultsCanvas);  
}

async function deleteSpell() {


        let url = baseUrl + '/delete/' + selected;
        let response = await fetch(url);
        
        console.log(response);

        loadAllSpells();


}

function emptyResults() {
    while (resultsCanvas.firstChild) {
        resultsCanvas.removeChild(resultsCanvas.firstChild);
    }
}

function createResultCard(data, parent) {
    //data = {id:val, age:val, kind:val, name:val}

    let resultsCard = document.createElement("span");
    resultsCard.classList.add("result-card");

    let index = document.createElement("h2");
    index.classList.add("index");
    index.textContent = data.index;

    let name = document.createElement("h1");
    name.classList.add("name");
    name.textContent = data.name;

    let url = document.createElement("h2");
    url.classList.add("url");
    url.textContent = data.url;

    resultsCard.append(name, index, url);
    parent.appendChild(resultsCard);
}