import { ACTIONS } from "./actions";
import { eventEmitter } from "./EventEmitter";
import { downloadAsImage } from "./export";
import { COLORS, setActiveColor } from "./color";

const keys = COLORS.map((_, index) => index + 1);
function initKeyboardEvents() {
  window.addEventListener("keydown", (e) => {
    const activeText = document.querySelector("div[contenteditable='true']")
    if (keys.includes(Number(e.key)) && !activeText) {
      setActiveColor(e.key);
    }
    switch (e.key) {
      case "a":
        if (e.ctrlKey) {
          eventEmitter.emit(ACTIONS.SELECT_ALL);
        }
        break;
      case "p": {
        if (e.ctrlKey) {
          e.preventDefault();
          const app = document.querySelector("#app");
          downloadAsImage(app);
        }
        break;
      }
      case "Backspace": {
        if (e.ctrlKey) {
          e.preventDefault();
          const divs = document.querySelectorAll("div[contenteditable]");
          divs.forEach((div) => {
            div.blur();
            div.remove();
          });
          eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
        }
        break;
      }
      case "Escape":
        eventEmitter.emit(ACTIONS.CLEAR_SELECTIONS);
        break;
      case "Delete":
        eventEmitter.emit(ACTIONS.DELETE_SELECTED_ITEMS);
        break;
    }
  });
}

export { initKeyboardEvents };
