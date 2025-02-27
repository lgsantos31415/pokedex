export function getType(type) {
  const bg = {
    grass: "#9BCC50",
    poison: "#B97FC9",
    fire: "#FD7D24",
    water: "#4592C4",
    flying: "#3DC7EF",
    bug: "#729F3F",
    normal: "#A4ACAF",
    electric: "#EED535",
    ground: "#AB9842",
    fairy: "#FDB9E9",
    fighting: "#D56723",
    rock: "#A38C21",
    psychic: "#F366B9",
    steel: "#9EB7B8",
    ice: "#51C4E7",
    ghost: "#7B62A3",
    dragon: "#53A4CF",
    dark: "#707070",
  };

  const cl = {
    grass: "black",
    poison: "white",
    fire: "white",
    water: "white",
    flying: "black",
    bug: "white",
    normal: "black",
    electric: "black",
    ground: "white",
    fairy: "black",
    fighting: "white",
    rock: "white",
    psychic: "white",
    steel: "black",
    ice: "black",
    ghost: "black",
    dragon: "white",
    dark: "white",
  };

  let span = document.createElement("span");

  span.style.backgroundColor = bg[type];
  span.style.color = cl[type];
  span.innerText = getFirstLatterUpperCase(type);

  return span;
}

export function getId(id) {
  id = id.toString();
  return `#${id.padStart(4, "0")}`;
}

export function getFirstLatterUpperCase(name) {
  const firstLetter = name[0].toUpperCase();
  const rest = name.slice(1);

  return `${firstLetter}${rest}`;
}

export function getName(name) {
  name = name.split("-");

  const newName = name.map((item) => getFirstLatterUpperCase(item)).join(" ");
  return newName;
}

export function searchByNameOrId(list, value) {
  if (Number(value)) {
    return list.filter((item) => item.url.split("/")[6].includes(value));
  } else {
    return list.filter((item) => item.name.includes(value));
  }
}

export async function fetchPokemon(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("");

    const json = await response.json();

    if (!json.is_default) {
      return null;
    }

    const response2 = await fetch(json.species.url);
    if (!response2.ok) throw new Error("");
    const json2 = await response2.json();

    const newObject = { ...json, ...json2 };

    return newObject;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchListPokemons() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1025`);

  return await response.json();
}

export function drawPokemon(cards, json, showModal, traducao) {
  if (!json) return;

  let card = document.createElement("div");
  card.classList.add("card");

  let enDescription = json.flavor_text_entries.findLast(
    (item) => item.language.name === traducao
  );

  let row2 = document.createElement("div");
  row2.id = "row2";
  row2.classList.add("row");

  let row3 = document.createElement("div");
  row3.id = "row3";
  row3.classList.add("row");

  const spans = json?.types.map((type) => getType(type.type.name));

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

  button.innerText =
    traducao === "en"
      ? "Know more"
      : traducao === "es"
      ? "Saber más"
      : "En savoir plus";

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

export function orderBy(list, condition) {
  switch (condition) {
    case 0:
      list.sort((a, b) => a.url.split("/")[6] - b.url.split("/")[6]);
      break;
    case 1:
      list.sort((a, b) => b.url.split("/")[6] - a.url.split("/")[6]);
      break;
    case 2:
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 3:
      list.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }
}

export function filterBy(list, condition) {
  if (condition === 0) {
    return list;
  }
  if (condition === "i") {
    return list.slice(0, 151);
  } else if (condition === "ii") {
    return list.slice(151, 251);
  } else if (condition === "iii") {
    return list.slice(251, 386);
  } else if (condition === "iv") {
    return list.slice(386, 493);
  } else if (condition === "v") {
    return list.slice(493, 649);
  } else if (condition === "vi") {
    return list.slice(649, 721);
  } else if (condition === "vii") {
    return list.slice(721, 809);
  } else if (condition === "viii") {
    return list.slice(809, 905);
  } else if (condition === "ix") {
    return list.slice(905, 1026);
  }
}
