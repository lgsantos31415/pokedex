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
  span.style.colro = cl[type];
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

export { getType, getId, getFirstLatterUpperCase };
