function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

class Search {
  constructor() {
    this.app = document.querySelector(".app");
    this.input = this.createElement("input", "input");
    this.dropDown = this.createElement("div", "dropDown");
    this.ul = this.createElement("ul");
    this.render();
  }
  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }
  render() {
    this.app.appendChild(this.input);
    this.app.appendChild(this.dropDown);
    this.dropDown.appendChild(this.ul);
  }
  open() {
    this.app.classList.add("open");
  }
  clouse() {
    this.app.classList.remove("open");
  }
}
const search = new Search();
let currentValue = "";

const debouncedLog = debounce(async function () {
  const data = await searchRepozit();
  if (data) {
    await processTemplate();
  }
}, 400);
const inputElement = document.querySelector(".input");

inputElement.addEventListener("input", function (event) {
  currentValue = event.target.value;
  if (currentValue.trim()) {
    debouncedLog();
    console.log(currentValue);
    return search.open();
  }
  search.clouse();
});

async function searchRepozit() {
  try {
    if (!currentValue.trim()) return;
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${currentValue}&per_page=5`
    );

    if (response.ok) {
      const data = await response.json();
      newdata = data.items;
      function renderResults(data) {
        const ul = document.querySelector("ul");
        ul.innerHTML = "";
        newdata.forEach((repo) => {
          const li = search.createElement("li", "options");
          li.textContent = repo.name;
          ul.appendChild(li);
        });
      }

      renderResults(newdata);

      return data;
    }
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
}

async function processTemplate() {
  const data = await searchRepozit();
  console.log(data.items);

  const listItems = document.querySelectorAll(".options");
  listItems.forEach((item, index) => {
    item.addEventListener("click", function (event) {
      const clickedElement = data.items[index];
      console.log(clickedElement);
      search.clouse();
      const selectedInstance = new Selected(clickedElement);
      clouseTemplate();
    });
  });
}

class Selected {
  constructor(items) {
    this.app = document.querySelector(".app");
    this.selected = this.createElement("div", "selected");
    this.clouse = this.createElement("div", "clouse");
    this.info = this.createElement("ul", "info");
    this.name = this.createElement("li", "name");
    this.owner = this.createElement("li", "owner");
    this.stars = this.createElement("li", "score");
    this.name.textContent = `Name: ${items.name}`;
    this.owner.textContent = `Owner: ${items.owner.login}`;
    this.stars.textContent = `Stars: ${items.stargazers_count}`;

    this.render();
  }

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  render() {
    this.app.appendChild(this.selected);
    this.selected.appendChild(this.clouse);
    this.selected.appendChild(this.info);
    this.info.appendChild(this.name);
    this.info.appendChild(this.owner);
    this.info.appendChild(this.stars);
    Selected.updateStyles();
  }
  static updateStyles() {
    const app = document.querySelector(".app");
    const selectedElements = app.querySelectorAll(".selected");

    selectedElements.forEach((item, index) => {
      item.style.marginTop = index === 0 ? "45px" : "0";
    });
  }
}
async function clouseTemplate() {
  const clouseListItems = document.querySelectorAll(".clouse");
  clouseListItems.forEach((item, index) => {
    item.addEventListener("click", function (event) {
      const parentElement = item.parentElement;
      if (parentElement) {
        parentElement.remove();
        Selected.updateStyles();
      }
    });
  });
}
