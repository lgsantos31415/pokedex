let offset = 0;
let cards = document.getElementById("cards");
let isLoading = false;
let modal = document.getElementById("modal");
let close = document.getElementById("close");

close.onclick = () => modal.classList.add("invisible");

window.addEventListener("scroll", () => {
  if (isLoading) return;

  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const total = header.offsetHeight + main.offsetHeight + 16;
  const scroll = window.scrollY + window.innerHeight;

  if (scroll + 25 >= total) {
    isLoading = true;
    offset += 6;
    start().finally(() => {
      isLoading = false;
    });
  }
});

import {
  getType,
  getId,
  getFirstLatterUpperCase,
} from "./functions/functions.js";

async function fetchListPokemons() {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=6&offset=${offset}`
  );
  return await response.json();
}

async function fetchPokemon(url) {
  const response = await fetch(url);
  const json = await response.json();

  const response2 = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${json.id}`
  );
  const json2 = await response2.json();
  const newObject = { ...json, ...json2 };

  return newObject;
}

async function showModal(id) {
  modal.classList.remove("invisible");

  const column2 = document.getElementById("column2");
  const idText = column2.querySelector("span");

  const poke = await fetchPokemon(`https://pokeapi.co/api/v2/pokemon/${id}`);
  console.log(poke);

  const img = modal.querySelector("img");
  img.src = poke.sprites.other["official-artwork"].front_default;
  img.alt = poke.name;

  idText.innerText = getId(poke.id);

  const row5 = document.getElementById("row5");
  const name = row5.querySelector("h1");
  name.innerText = getFirstLatterUpperCase(poke.name);

  const playAudio = row5.querySelector("button");
  const audio = row5.querySelector("audio");
  const source = row5.querySelector("source");
  source.src = poke.cries.latest;
  audio.load();

  playAudio.onclick = () => audio.play();

  const row6 = document.getElementById("row6");
  Array.from(row6.childNodes).forEach((item) => row6.removeChild(item));

  for (const type of poke.types) {
    const newSpan = getType(type.type.name);
    row6.appendChild(newSpan);
  }

  let enDescription = poke.flavor_text_entries.findLast(
    (item) => item.language.name === "en"
  );

  const p = column2.querySelector("p");
  p.innerText = enDescription.flavor_text;

  const neight = document.querySelectorAll(".neight");
  const height = neight[0].querySelectorAll("span")[1];
  const weight = neight[1].querySelectorAll("span")[1];

  height.innerText = `${(poke.height / 10).toFixed(1)}m`;
  weight.innerText = `${(poke.weight / 10).toFixed(1)}kg`;

  const stats = document.querySelectorAll(".stats");

  const hp = stats[0].querySelectorAll("span");
  hp[1].innerText = poke.stats[0].base_stat;

  const atk = stats[1].querySelectorAll("span");
  atk[1].innerText = poke.stats[1].base_stat;

  const def = stats[2].querySelectorAll("span");
  def[1].innerText = poke.stats[2].base_stat;

  const spa = stats[3].querySelectorAll("span");
  spa[1].innerText = poke.stats[3].base_stat;

  const spd = stats[4].querySelectorAll("span");
  spd[1].innerText = poke.stats[4].base_stat;

  const spe = stats[5].querySelectorAll("span");
  spe[1].innerText = poke.stats[5].base_stat;
}

function drawPokemon(json) {
  let card = document.createElement("div");
  card.classList.add("card");

  let enDescription = json.flavor_text_entries.findLast(
    (item) => item.language.name === "en"
  );

  let row2 = document.createElement("div");
  row2.id = "row2";
  row2.classList.add("row");

  let row3 = document.createElement("div");
  row3.id = "row3";
  row3.classList.add("row");

  const spans = json.types.map((type) => getType(type.type.name));

  let span = document.createElement("span");
  span.innerText = getId(json.id);

  let row4 = document.createElement("div");
  row4.id = "row4";
  row4.classList.add("row");

  let column1 = document.createElement("div");
  column1.id = "column1";
  column1.classList.add("column");

  let h1 = document.createElement("h1");
  h1.innerText = getFirstLatterUpperCase(json.name);

  let p = document.createElement("p");
  p.innerText = enDescription.flavor_text;

  let button = document.createElement("button");
  button.innerText = "Know more";
  button.onclick = () => showModal(json.id);

  let img = document.createElement("img");
  img.src = json.sprites.other["official-artwork"].front_default;
  img.alt = json.name;

  spans.forEach((item) => row3.appendChild(item));

  row2.appendChild(row3);
  row2.appendChild(span);

  column1.appendChild(h1);
  column1.appendChild(p);
  column1.appendChild(button);

  row4.appendChild(column1);
  row4.appendChild(img);

  card.appendChild(row2);
  card.appendChild(row4);

  cards.appendChild(card);
}

async function start() {
  let list = await fetchListPokemons();
  for (const item of list.results) {
    const pokemon = await fetchPokemon(item.url);
    drawPokemon(pokemon);
  }
}

start();
