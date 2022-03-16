import { ACTIONS } from "./actions";
import { eventEmitter } from "./EventEmitter";

function initKeyboardEvents() {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "a":
        if (e.ctrlKey) {
          eventEmitter.emit(ACTIONS.SELECT_ALL);
        }
        break;
      case "Escape":
        eventEmitter.emit(ACTIONS.CLEAR_SELECTIONS)
        break;
      case "Delete":
        eventEmitter.emit(ACTIONS.DELETE_SELECTED_ITEMS)
        break;
    }
  });
}

export { initKeyboardEvents };
