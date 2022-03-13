import interact from "interactjs";
import {saveToStorage} from "./storage"
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
        const data = {
          id: event.target.id, 
          text: event.target.textContent,
          x: event.rect.left,
          y: event.rect.top,
          textSize: event.target.style.fontSize.replace("px", "")
        }
        saveToStorage(data);
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
