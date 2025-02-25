import {
  getType,
  getId,
  getFirstLatterUpperCase,
  fetchPokemon,
  fetchListPokemons,
  drawPokemon,
} from "./functions/functions.js";

let begin = 0;
let end = 6;
let listOfAllPokemons;

async function start() {
  let { results } = await fetchListPokemons();

  listOfAllPokemons = results;

  for (let y = begin; y <= end; y++) {
    const pokemon = await fetchPokemon(listOfAllPokemons[y].url);
    drawPokemon(pokemon, showModal);
  }
}

start();

let isLoading = false;

let modal = document.getElementById("modal");
let close = document.getElementById("close");

const img = modal.querySelector("img"); //img

const column2 = document.getElementById("column2");
const idText = column2.querySelector("span"); //id
const row5 = document.getElementById("row5");

const name = row5.querySelector("h1"); //name

const playAudio = row5.querySelector("button");
const audio = row5.querySelector("audio");
const source = row5.querySelector("source");

const row6 = document.getElementById("row6");

const p = column2.querySelector("p"); //description

const neight = document.querySelectorAll(".neight");

const height = neight[0].querySelectorAll("span")[1]; //height
const weight = neight[1].querySelectorAll("span")[1]; //weight

const stats = document.querySelectorAll(".stats");

const hp = stats[0].querySelectorAll("span"); //hp
const atk = stats[1].querySelectorAll("span"); //atk
const def = stats[2].querySelectorAll("span"); //def
const spa = stats[3].querySelectorAll("span"); //spa
const spd = stats[4].querySelectorAll("span"); //spd
const spe = stats[5].querySelectorAll("span"); //spe

close.onclick = closeModal;

window.addEventListener("scroll", () => {
  if (isLoading) return;

  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const total = header.offsetHeight + main.offsetHeight + 16;
  const scroll = window.scrollY + window.innerHeight;

  if (scroll + 25 >= total) {
    isLoading = true;
    begin += 6;
    end += 6;
    start().finally(() => {
      isLoading = false;
    });
  }
});

async function showModal(id) {
  modal.classList.remove("invisible");

  const poke = await fetchPokemon(`https://pokeapi.co/api/v2/pokemon/${id}`);

  img.src = poke.sprites.other["official-artwork"].front_default;
  img.alt = poke.name;

  idText.innerText = getId(poke.id);

  name.innerText = getFirstLatterUpperCase(poke.name);

  source.src = poke.cries.latest;
  audio.load();

  playAudio.onclick = () => audio.play();

  Array.from(row6.childNodes).forEach((item) => row6.removeChild(item));

  for (const type of poke.types) {
    const newSpan = getType(type.type.name);
    row6.appendChild(newSpan);
  }

  let enDescription = poke.flavor_text_entries.findLast(
    (item) => item.language.name === "en"
  );

  p.innerText = enDescription.flavor_text;

  height.innerText = `${(poke.height / 10).toFixed(1)}m`;
  weight.innerText = `${(poke.weight / 10).toFixed(1)}kg`;

  hp[1].innerText = poke.stats[0].base_stat;

  atk[1].innerText = poke.stats[1].base_stat;

  def[1].innerText = poke.stats[2].base_stat;

  spa[1].innerText = poke.stats[3].base_stat;

  spd[1].innerText = poke.stats[4].base_stat;

  spe[1].innerText = poke.stats[5].base_stat;
}

function closeModal() {
  modal.classList.add("invisible");

  img.src =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  idText.innerText = "carregando...";
  name.innerText = "carregando...";
  p.innerText = "carregando...";
  height.innerText = "...";
  weight.innerText = "...";
  hp.innerText = "...";
  atk.innerText = "...";
  def.innerText = "...";
  spa.innerText = "...";
  spd.innerText = "...";
  spe.innerText = "...";
}
