const bg = {
  grass: "#9BCC50",
  poison: "#B97FC9",
  fire: "#FD7D24",
  water: "#FD7D24",
  flying: "#3DC7EF",
};

const cl = {
  grass: "black",
  poison: "white",
  fire: "white",
  water: "black",
  flying: "black",
};

function getType(type) {
  let span = document.createElement("span");

  span.style.backgroundColor = bg[type];
  span.style.color = cl[type];
  span.innerText = getFirstLatterUpperCase(type);

  return span;
}

function getId(id) {
  id = id.toString();
  return `#${id.padStart(4, "0")}`;
}

function getFirstLatterUpperCase(name) {
  const firstLetter = name[0].toUpperCase();
  const rest = name.slice(1);

  return `${firstLetter}${rest}`;
}

function getName(name) {
  if (name.includes("-f")) {
    return getFirstLatterUpperCase(name.split("-f")[0]);
  } else if (name.includes("-m")) {
    return getFirstLatterUpperCase(name.split("-m")[0]);
  } else {
    return getFirstLatterUpperCase(name);
  }
}

function searchByNameOrId() {
  "https://pokeapi.co/api/v2/pokemon?limit=1304";
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

async function fetchListPokemons() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1304`);
  return await response.json();
}

function drawPokemon(json, showModal) {
  let cards = document.getElementById("cards");

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
  h1.innerText = getName(json.name);

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

export {
  getType,
  getId,
  getFirstLatterUpperCase,
  getName,
  fetchPokemon,
  fetchListPokemons,
  drawPokemon,
};
