import { selection, isSelectionActive, getSelectedItems, removeSelections } from "./selection";
import { addInteract } from "./drag";
import { getDataFromStorage } from "./storage";
import { ACTIONS } from "./actions";
import { eventEmitter } from "./EventEmitter";
import { onScroll } from "./scroll";
import { guideItems } from "./initialData";
import { initKeyboardEvents } from "./keyboard";
import { createDiv, resetAllEditableDivs } from "./dom";
import { getActiveColor } from "./color";
import "../style.css";

const ID_PREFIX = "bos-editor-";
let id = 0;
let textSize = 16;

window.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  const option = document.querySelector("#option");

  loadData();
  initKeyboardEvents();
  window.addEventListener("wheel", onScroll);

  window.addEventListener("click", function (event) {
    if (event.target.id !== "app" || isSelectionActive) {
      return;
    }
    const nextId = ++id;
    const div = createDiv(ID_PREFIX + nextId, event.pageX, event.pageY, textSize, getActiveColor());
    removeSelections();
    resetAllEditableDivs();
    addInteract(div);
    app.appendChild(div);
  });


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
        color: element.style.color,
      });
    });
    localStorage.setItem("bos_data", JSON.stringify(data));
  });
  
  eventEmitter.on(ACTIONS.SELECT_ALL, () => {
    selection.select("div[contenteditable]");
  });
  eventEmitter.on(ACTIONS.CLEAR_SELECTIONS, () => {
    document.querySelector("div[contenteditable='true'")?.blur();
    document.querySelectorAll(".selected").forEach((item) => item.classList.remove("selected"));
    selection.clearSelection(true);
  });
  eventEmitter.on(ACTIONS.DELETE_SELECTED_ITEMS, () => {
    const selectedItems = selection.getSelection();
    selectedItems.forEach((item) => {
      item.remove();
      eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
    });
  });
});



function loadData() {
  let data = getDataFromStorage();
  const isFirstTime = localStorage.getItem("bos-guide");
  if (data.length === 0 && isFirstTime !== "hide") {
    data = guideItems;
  }
  if (data.length === 0) return;
  const app = document.querySelector("#app");
  id = Number(data[data.length - 1].id.replace(ID_PREFIX, ""));
  data.forEach((item) => {
    const div = createDiv(item.id, item.x, item.y, item.textSize, item.color);
    div.innerHTML = item.text;
    addInteract(div);
    app.appendChild(div);
  });

  localStorage.setItem("bos-guide", "hide");
}

function updateSelectedElements() {
  const activeElement = document.querySelector("div[contenteditable='true']");
  const selectedItems = document.querySelectorAll(".selected");
  const allItems = [activeElement, ...selectedItems].filter((i) => i !== null);
  if (!allItems.length === 0) return;
  allItems.forEach((item) => {
    item.style.fontSize = textSize + "px";
    eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
  });
}

function updateFontSizeIndicator() {
  const element = document.querySelector(".text-size");
  element.style.fontSize = textSize + "px";
}

function getColor(index) {
  return COLORS[index % COLORS.length];
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
}
