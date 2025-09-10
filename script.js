/*
Api:  https://pokeapi.co/
Docs: https://pokeapi.co/docs/v2
*/

// components
const container = document.getElementById('container');
const btn = document.getElementById('btn');
const search = document.getElementById('search');

const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');
const pageNumber = document.getElementById('current');

// data storage
let basePath = "https://pokeapi.co/api/v2/pokemon?limit=10";
let previous = null;
let next = null;

let page = 1;

// counter of requests
let requestId = 0;

// fetch list of pokemons
async function fetchPokemons(path) {
    const id = ++requestId; // assign unique id to this request

    try {
        const res = await fetch(path || basePath);
        const data = await res.json();

        // if another request was started later, ignore this result
        if (id !== requestId) return;

        // clean content
        container.innerHTML = '';
        // create content
        data.results.forEach(async (p) => {
            const pokeRes = await fetch(p.url); // endpoint per pokemon
            const pokeData = await pokeRes.json();

            // again, check before rendering
            if (id !== requestId) return;

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${pokeData.name}</h3>
                <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
            `;
            container.appendChild(card);
        });

        if (id !== requestId) return;

        // update page buttons
        previous = data.previous;
        next = data.next;
        updatePageButtons(true);

    } catch (err) {

        if (id !== requestId) return; // ignore outdated errors

        container.innerHTML = `<p>Error loading Pokémon</p>`;
        // hide page buttons
        updatePageButtons(false);
    }
}

// fetch by search param
async function fetchByName(name) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) {
            container.innerHTML = `<p>Not found</p>`;
            return;
        }
        const data = await res.json();

        container.innerHTML = `
        <div class="card">
            <h3>${data.name}</h3>
            <img src="${data.sprites.front_default}" alt="${data.name}">
        </div>`;

    } catch (err) {
        container.innerHTML = `<p>Error loading Pokémon</p>`;
    }
    // hide page buttons
    updatePageButtons(false);
}

btn.addEventListener('click', () => {
    const value = search.value.trim().toLowerCase();
    if (value) 
        fetchByName(value);
    else 
        fetchPokemons(null);
        page = 1;
});

// initial load
fetchPokemons();

// page buttons
const updatePageButtons = (show) => {
    btnPrev.disabled = !previous;
    btnNext.disabled = !next;

    btnPrev.onclick = function() {
        if (previous) {
            page--;
            fetchPokemons(previous);
        }
    };

    btnNext.onclick = function() {
        if (next) {
            page++;
            fetchPokemons(next);
        }
    };

    pageNumber.innerHTML = page;

    // show or hide page buttons
    if(show){
        btnPrev.style.display = "block";
        btnNext.style.display = "block";
        pageNumber.style.display = "block";
    }else{
        btnPrev.style.display = "none";
        btnNext.style.display = "none";
        pageNumber.style.display = "none";
    };
};