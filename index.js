let resultsCanvas = document.getElementById('results');
let searchInput = document.getElementById('searchField');
let searchButton = document.getElementById('searchButton');
let updateOldName = document.getElementById('oldname');
let updateNewName = document.getElementById('newname');
let baseUrl = 'http://localhost:8006/spells'

async function loadAllSpells() {

    let url = baseUrl;
    let response = await fetch(url);
    let data = await response.json();

    data.map(spell => {
      createResultCard(spell, resultsCanvas);  
    })
}

async function searchSpells() {

    let url = baseUrl + '/name/' + searchInput.value;
    let response = await fetch(url);
    let data = await response.json();

    data.map(spell => {
      createResultCard(spell, resultsCanvas);  
    })
}

async function updateSpells() {

    let url = baseUrl + '/update/' + updateOldName.value + '/' + updateNewName.value;
    url = url.replace(' ', '+')
    console.log(url)
    let response = await fetch(url);
    let data = await response.json();

    resultsCanvas.append(JSON.stringify(data))

      //createResultCard(data, resultsCanvas);  

}

function createResultCard(data, parent) {
    //data = {id:val, age:val, kind:val, name:val}

    let resultsCard = document.createElement("span");
    resultsCard.classList.add("result-card");

    let index = document.createElement("h1");
    index.classList.add("index");
    index.textContent = data.index;

    let name = document.createElement("h2");
    name.classList.add("name");
    name.textContent = data.name;

    let url = document.createElement("h2");
    url.classList.add("url");
    url.textContent = data.url;

    resultsCard.append(index, name, url);
    parent.appendChild(resultsCard);
}