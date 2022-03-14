import SelectionArea from "@viselect/vanilla";
import { eventEmitter } from "./EventEmitter";

  const selection = new SelectionArea({
    selectables: ["div[contenteditable]"],
    boundaries: ["#app"],
  })
    .on("beforestart", ({ event }) => {
      if (event.target.hasAttribute("contenteditable")) {
        return false;
      }
    })
    .on("start", ({ store, event }) => {
      if (event.target.hasAttribute("contenteditable")) {
        return;
      }
      if (!event.ctrlKey && !event.metaKey) {
        for (const el of store.stored) {
          el.classList.remove("selected");
        }

        selection.clearSelection();
      }
    })
    .on(
      "move",
      ({
        store: {
          changed: { added, removed },
        },
      }) => {
        for (const el of added) {
          el.classList.add("selected");
        }

        for (const el of removed) {
          el.classList.remove("selected");
        }
      }
    )
    .on("stop", ({ store }) => {
    });




function removeSelections() {
  document.querySelectorAll(".selected").forEach(item => item.classList.remove('selected'))
  selection.clearSelection(true)
}

export {selection, removeSelections}