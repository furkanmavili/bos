import interact from "interactjs";
import { eventEmitter } from "./EventEmitter";
import { ACTIONS } from "./actions";
function addInteract(element) {
  interact(element).draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: false,
      }),
    ],
    autoScroll: true,
    listeners: {
      move: dragMoveListener,
      end(event) {
        eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT)
      },
    },
  });
}

function dragMoveListener(event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.transform = "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

export { addInteract };
