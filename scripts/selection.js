import SelectionArea from "@viselect/vanilla";

let selectedItems = []

const initSelectionArea = () => {
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
    .on("stop", ({ store: {selected} }) => {
      selectedItems = selected
    });
};

function getSelectedItems() {
  return selectedItems
}

export {initSelectionArea, getSelectedItems}