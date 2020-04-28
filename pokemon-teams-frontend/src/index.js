const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons/`


getTrainers()
    .then(results => {
        const trainers = results.data;
        const div = document.getElementById("trainers");
        const pokemonList = results.included;

        for (const trainer of trainers) { 

            let newCard = document.createElement("div");
            newCard.classList.add("card");
            newCard.dataset.id = trainer.id;
            
            let name = document.createElement("p");
            name.innerText = trainer.attributes.name;

            let addPokemon = document.createElement("button");
            addPokemon.dataset.trainerId = trainer.id;
            addPokemon.innerText = "Add Pokemon";
            addPokemon.addEventListener('click', checkTeamSize);

            let pokeUl = document.createElement("ul");
            
            for (const pokemon of pokemonList) {
                if (trainer.id == pokemon.relationships.trainer.data.id) {
                    const pokeLi = document.createElement("li");
                    pokeLi.innerText = `${pokemon.attributes.nickname} (${pokemon.attributes.species})`;

                    const releaseButton = document.createElement("button");
                    releaseButton.classList.add("release");
                    releaseButton.dataset.pokemonId = pokemon.id;
                    releaseButton.innerText = "Release";
                    releaseButton.addEventListener("click", releasePokemon);

                    pokeLi.appendChild(releaseButton);
                    pokeUl.appendChild(pokeLi);
                }
            }

            newCard.appendChild(name);
            newCard.appendChild(addPokemon);
            newCard.appendChild(pokeUl);

            div.appendChild(newCard);
            
            // console.log(pokemonList[0].id);
        }

        //  console.log(results.data[0].attributes.name);
    })
    .catch(err => console.error(err));



async function getTrainers() {
    const response = await fetch(TRAINERS_URL);
    const json = await response.json();
    return json;
}

function checkTeamSize() {
    const size = event.target.nextSibling.childNodes.length;
    if (size < 6) {
        getNewPokemon();
    }
}

async function getNewPokemon() {

        const trainer_id = event.target.dataset["trainerId"]
        const formData = {
            "trainer_id": trainer_id
        }
        const configObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(formData) 
        };
        try {
            const fetchResponse = await fetch(TRAINERS_URL, configObj);
            const data = await fetchResponse.json();
            createNewPokemon(data, trainer_id);
        } catch (e) {
            return e;
        }
    }


function createNewPokemon(data, trainer_id) {
    const parentUl = document.querySelectorAll(`[data-id='${trainer_id}']`)[0].querySelector('ul');
    const newPokemon = document.createElement("li");
    newPokemon.innerText = `${data.nickname} (${data.species})`;

    const releaseButton = document.createElement("button");
    releaseButton.classList.add("release");
    releaseButton.dataset.pokemonId = data.id;
    releaseButton.innerText = "Release";
    releaseButton.addEventListener("click", releasePokemon);

    newPokemon.appendChild(releaseButton);
    parentUl.appendChild(newPokemon);
}

async function releasePokemon() {
    const target = event.target;
    const pokemon_id = event.target.dataset["pokemonId"]
    const formData = {
        "pokemon_id": pokemon_id
    }
    const configObj = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(formData) 
    };
    try {
        const fetchResponse = await fetch(POKEMONS_URL + `:${pokemon_id}`, configObj);
        const data = await fetchResponse.json();
        removePokemonLi(target);
    } catch (e) {
    return e;
    }
}

function removePokemonLi(target) {
    removeLi = target.parentNode;
    UlRemover = removeLi.parentNode;
    UlRemover.removeChild(removeLi);
}