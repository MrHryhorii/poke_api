/*
Api:  https://pokeapi.co/
Docs: https://pokeapi.co/docs/v2
*/

const container = document.getElementById('container');
const btn = document.getElementById('btn');
const search = document.getElementById('search');

// fetch list of pokemons
async function fetchPokemons() {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
        const data = await res.json();

        container.innerHTML = '';
        data.results.forEach(async (p) => {
        const pokeRes = await fetch(p.url); // endpoint per pokemon
        const pokeData = await pokeRes.json();

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${pokeData.name}</h3>
            <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
        `;
        container.appendChild(card);

        });
    } catch (err) {
        container.innerHTML = `<p>Error loading Pokémon</p>`;
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
}

btn.addEventListener('click', () => {
    const value = search.value.trim().toLowerCase();
    if (value) 
        fetchByName(value);
    else 
        fetchPokemons();
});

// initial load
fetchPokemons();