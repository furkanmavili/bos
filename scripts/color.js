import { eventEmitter } from "./EventEmitter";
import { ACTIONS } from "./actions";
import { getSelectedItems } from "./selection";

const COLORS = ["hsl(210, 17%, 82%)", "#f87171", "#22d3ee", "#22c55e", "#facc15"];
let color = 0;

function getActiveColor() {
  return COLORS[color]
}
function setActiveColor(index) {
  color = index - 1
  const option = document.querySelector("#textIndicator")
  const selectedItems = getSelectedItems();
  selectedItems.forEach((item) => {
    item.style.color = COLORS[color];
  });
  option.style.color = COLORS[color];
  eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
} 



export {getActiveColor, setActiveColor, COLORS}