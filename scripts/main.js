import { initSelectionArea, getSelectedItems } from "./selection";
import { addInteract } from "./drag";
import { getDataFromStorage, removeItemFromStorage, saveToStorage, updateItem } from "./storage";
import { ACTIONS } from "./actions";
import { eventEmitter } from "./EventEmitter";
import { checkScrollDirection } from "./scroll";
import "../style.css";

const ID_PREFIX = "bos-editor-";
let id = 0;
let textSize = 16;

window.addEventListener("DOMContentLoaded", () => {
  addDataToDom();
  const app = document.querySelector("#app");
  window.addEventListener("click", function (event) {
    if (event.target.id !== "app") return;
    resetAllEditableDivs()
    const nextId = ++id;
    const div = createDiv(ID_PREFIX + nextId, event.pageX, event.pageY, textSize);
    addInteract(div);
    app.appendChild(div);
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Delete") {
      const selectedItems = getSelectedItems();
      selectedItems.forEach((item) => {
        item.remove();
        removeItemFromStorage(item.id);
      });
    }
  });
  window.addEventListener("wheel", checkScrollDirection);
  eventEmitter.on(ACTIONS.INCREASE_FONT, () => {
    if (textSize > 32) return;
    textSize += 2;
    updateActiveElementFontSize()
    updateFontSizeIndicator();
  });
  eventEmitter.on(ACTIONS.DECREASE_FONT, () => {
    if (textSize < 14) return;
    textSize -= 2;
    updateActiveElementFontSize()
    updateFontSizeIndicator();
  });

  initSelectionArea();
});



function createDiv(id, x, y, textSize) {
  const div = document.createElement("div");
  div.setAttribute("contenteditable", "true");
  div.setAttribute("id", id);
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.fontSize = textSize + "px";
  div.addEventListener("input", function (event) {
    saveToStorage({id, text: event.target.textContent, x, y, textSize});
  });
  div.addEventListener("click", function (event) {
    event.target.setAttribute("contenteditable", "true");
    event.target.focus();
  });
  div.addEventListener("blur", function (event) {
    if (event.target.textContent === "") {
      event.target.remove();
    } else {
      event.target.setAttribute("contenteditable", "false");
      saveToStorage({id, text: event.target.textContent, x, y, textSize: event.target.style.fontSize.replace("px", "")});
    }
  });
  setTimeout(function () {
    div.focus();
  }, 0);
  return div;
}

function addDataToDom() {
  let data = getDataFromStorage();
  if (data.length === 0) {
    data = [
      {
        id: "bos-editor-0",
        text: "Click anywhere :)",
        textSize: 16,
        x: window.innerWidth / 2 - 140,
        y: window.innerHeight / 2,
      },
    ];
  }
  const app = document.querySelector("#app");
  id = Number(data[data.length - 1].id.replace(ID_PREFIX, ""));
  data.forEach((item) => {
    const div = createDiv(item.id, item.x, item.y, item.textSize);
    div.innerHTML = item.text;
    addInteract(div);
    app.appendChild(div);
  });
}

function resetAllEditableDivs() {
  document.querySelectorAll("div[contenteditable='true']").forEach(item => {
  item.setAttribute('contenteditable', 'false')
  })
}

function updateActiveElementFontSize() {
  const activeElement = document.querySelector("div[contenteditable='true']")
  console.log(activeElement)
  activeElement.style.fontSize = textSize + "px"
  updateItem(activeElement.id, {textSize: textSize})
}

function updateFontSizeIndicator() {
  const element = document.querySelector(".text-size");
  element.style.fontSize = textSize + "px";
}