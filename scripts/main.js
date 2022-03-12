import {initSelectionArea, getSelectedItems} from "./selection"
import { addInteract } from "./dragDrop";
import { getDataFromStorage, removeItemFromStorage, saveToStorage } from "./storage";
import "../style.css";


const ID_PREFIX = "bos-editor-"
let id = 0;

window.addEventListener("DOMContentLoaded", () => {
  addDataToDom()
  const app = document.querySelector("#app");
  window.addEventListener("click", function (event) {
    if (event.target.id !== "app") return;
    const nextId = ++id
    const div = createDiv(ID_PREFIX + nextId, event.pageX, event.pageY);
    addInteract(div, saveToStorage)
    app.appendChild(div);
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Delete") { 
      const selectedItems = getSelectedItems()
      selectedItems.forEach(item => {
        item.remove()
        removeItemFromStorage(item.id)
      })
    }
  })
  initSelectionArea()
});

function createDiv( id, x, y,) {
  const div = document.createElement("div");
  div.setAttribute("contenteditable", "true");
  div.setAttribute("id", id);
  div.style.left = x + "px";
  div.style.top =  y + "px";
  div.addEventListener('input', function(event) {
    saveToStorage(id, event.target.textContent, x, y)
  })
  div.addEventListener("click", function(event) {
    event.target.setAttribute("contenteditable", "true")
    event.target.focus()
  })
  div.addEventListener("blur", function(event) {
    if (event.target.textContent === "") {
      event.target.remove()
    } else {
      event.target.setAttribute("contenteditable", "false")
      saveToStorage(id, event.target.textContent, x, y)
    }
  })
  setTimeout(function () {
    div.focus();
  }, 0);
  return div;
}


function addDataToDom() {
  let data = getDataFromStorage()
  if (data.length === 0) {
    data = [{
      id: "bos-editor-0",
      text: "Click anywhere :)",
      x: window.innerWidth / 2 - 140,
      y: window.innerHeight / 2,
    }]
  }
  const app = document.querySelector("#app");
  id = Number(data[data.length - 1].id.replace(ID_PREFIX, "")) 
  data.forEach((item) => {
    const div = createDiv(item.id, item.x, item.y)
    div.innerHTML = item.text
    addInteract(div, saveToStorage)
    app.appendChild(div)
  })
}








