import { selection, removeSelections} from "./selection";
import { addInteract } from "./drag";
import { getDataFromStorage, updateItem } from "./storage";
import { ACTIONS } from "./actions";
import { eventEmitter } from "./EventEmitter";
import { onScroll } from "./scroll";
import {guideItems} from "./initialData"
import {downloadAsImage} from "./export"
import "../style.css";

const ID_PREFIX = "bos-editor-";
const COLORS = ["hsl(210, 17%, 82%)", "#f87171", "#22d3ee", "#22c55e", "#facc15"];
let color = 0;
let id = 0;
let textSize = 16;

window.addEventListener("DOMContentLoaded", () => {
  addDataToDom();
  const app = document.querySelector("#app");
  const option = document.querySelector("#option")
  window.addEventListener("click", function (event) {
    if (event.target.id === "option") {
      onOptionClick()
      return;
    } else if (event.target.id === "saveAs") {
      downloadAsImage(app)
    }
    if (event.target.id !== "app") return;
    resetAllEditableDivs();
    // removeSelections()
    const nextId = ++id;
    const div = createDiv(ID_PREFIX + nextId, event.pageX, event.pageY, textSize, getColor(color));
    addInteract(div);
    app.appendChild(div);
  });
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "Tab":
        e.preventDefault();
        break;
      case "Escape":
        document.querySelector("div[contenteditable='true'")?.blur();
        document.querySelectorAll(".selected").forEach(item => item.classList.remove('selected'))
        selection.clearSelection(true)
        break;
      case "Delete":
        const selectedItems = selection.getSelection();
        selectedItems.forEach((item) => {
          item.remove();
          eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
        });
    }
  });
  window.addEventListener("wheel", onScroll);
  eventEmitter.on(ACTIONS.SCROLL_END, (_, payload) => {
    if (payload.direction === "up") {
      if (textSize > 32) return;
      textSize += 2;
    } else {
      if (textSize < 14) return;
      textSize -= 2;
    }
    updateSelectedElements();
    updateFontSizeIndicator();
  });

  eventEmitter.on(ACTIONS.TAKE_SNAPSHOT, () => {
    const elements = document.querySelectorAll("div[contenteditable]");
    let data = [];
    elements.forEach((element) => {
      data.push({
        id: element.id,
        x: getOffset(element).left,
        y: getOffset(element).top,
        text: element.textContent,
        textSize: element.style.fontSize.replace("px", ""),
        color: element.style.color 
      });
    });

    localStorage.setItem("bos_data", JSON.stringify(data));
  });
  eventEmitter.on(ACTIONS.CHANGE_COLOR, (_, payload) => {
    console.log(payload.color)
    option.style.color = payload.color
  })
});

function createDiv(id, x, y, textSize, color) {
  const div = document.createElement("div");
  div.setAttribute("contenteditable", "true");
  div.setAttribute("id", id);
  div.setAttribute("data-x", 0);
  div.setAttribute("data-y", 0);
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.fontSize = textSize + "px";
  div.style.color = color;
  div.addEventListener("input", function (event) {
    eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
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
      eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
    }
  });
  setTimeout(function () {
    div.focus();
  }, 0);
  return div;
}

function addDataToDom() {
  let data = getDataFromStorage();
  const isFirstTime = localStorage.getItem("bos-guide")
  if (data.length === 0 && isFirstTime !== "hide") {
    data = guideItems
  }
  if (data.length === 0) return
  const app = document.querySelector("#app");
  id = Number(data[data.length - 1].id.replace(ID_PREFIX, ""));
  data.forEach((item) => {
    const div = createDiv(item.id, item.x, item.y, item.textSize, item.color);
    div.innerHTML = item.text;
    addInteract(div);
    app.appendChild(div);
  });

  localStorage.setItem("bos-guide", "hide")
}

function resetAllEditableDivs() {
  document.querySelectorAll("div[contenteditable='true']").forEach((item) => {
    item.setAttribute("contenteditable", "false");
  });
}

function updateSelectedElements() {
  const activeElement = document.querySelector("div[contenteditable='true']");
  const selectedItems = document.querySelectorAll(".selected")
  const allItems = [activeElement, ...selectedItems]
  if (!allItems.length === 0 || !activeElement) return
  allItems.forEach(item => {
    item.style.fontSize = textSize + "px";
    eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
  })
}

function updateFontSizeIndicator() {
  const element = document.querySelector(".text-size");
  element.style.fontSize = textSize + "px";
}

function onOptionClick(e) {
  eventEmitter.emit(ACTIONS.CHANGE_COLOR, {color: COLORS[++color % COLORS.length]})
}

function getColor(index) {
  return COLORS[index % COLORS.length]
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
}
