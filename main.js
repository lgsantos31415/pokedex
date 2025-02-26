import {
  getType,
  getId,
  getFirstLatterUpperCase,
  fetchPokemon,
  fetchListPokemons,
  drawPokemon,
  searchByNameOrId,
  orderBy,
  filterBy,
} from "./functions/functions.js";

let begin = 0;
let end = 9;
let listOfAllPokemons;
let cards = document.getElementById("cards");

let order = document.getElementById("order");
let orderValue = 0;
let filter = document.getElementById("filter");
let filterValue = 0;

order.addEventListener("change", async (e) => {
  cards.innerHTML = "";
  orderValue = e.target.value;

  begin = 0;
  end = 5;
  await start();
});

filter.addEventListener("change", async (e) => {
  cards.innerHTML = "";
  filterValue = e.target.value;

  begin = 0;
  end = 5;
  await start();
});

async function start() {
  let { results } = await fetchListPokemons();
  listOfAllPokemons = results;

  orderBy(listOfAllPokemons, Number(orderValue));
  listOfAllPokemons = filterBy(listOfAllPokemons, filterValue);

  drawAllPokemon(listOfAllPokemons);
}

async function drawAllPokemon() {
  for (let y = begin; y <= end; y++) {
    const pokemon = await fetchPokemon(listOfAllPokemons[y].url);

    if (pokemon) {
      drawPokemon(cards, pokemon, showModal);
    } else {
      end++;
    }
  }
}

start();

const input = document.querySelector("input");
const search = document.getElementById("search");

let isSearch = false;

input.addEventListener("input", async (e) => {
  if (e.target.value.length === 0 && isSearch) {
    cards.innerHTML = "";

    begin = 0;
    end = 5;
    await start();
  }
});

search.onclick = async () => {
  if (input.value.length > 0) {
    const newList = searchByNameOrId(listOfAllPokemons, input.value);

    if (newList.length > 0) {
      cards.innerHTML = "";
      isSearch = true;

      for (const item of newList) {
        const pokemon = await fetchPokemon(item.url);
        drawPokemon(cards, pokemon, showModal);
      }
    }
  }
};

let isLoading = false;

let modal = document.getElementById("modal");
let close = document.getElementById("close");

close.onclick = closeModal;

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

window.addEventListener("scroll", () => {
  if (isSearch) return;

  if (isLoading) return;

  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const total = header.offsetHeight + main.offsetHeight + 16;
  const scroll = window.scrollY + window.innerHeight;

  if (scroll + 25 >= total) {
    isLoading = true;
    begin = Math.min(begin + 6, 1300);
    end = Math.min(end + 6, 1306);
    drawAllPokemon().finally(() => {
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

const wrapper = document.getElementById("wrapper");
const siderbarMenu = document.getElementById("sidebar");
const buttonclosesidebar = document.getElementById("closesidebar");
buttonclosesidebar.onclick = closeSidebar;
const buttonopensidebar = document.getElementById("opensidebar");
buttonopensidebar.onclick = openSidebar;

function openSidebar() {
  wrapper.classList.remove("invisible");
  siderbarMenu.classList.remove("rightanimation");
}

function closeSidebar() {
  wrapper.classList.add("invisible");
  siderbarMenu.classList.add("rightanimation");
}
