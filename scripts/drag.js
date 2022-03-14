import interact from "interactjs";
import { eventEmitter } from "./EventEmitter";
import { ACTIONS } from "./actions";
function addInteract(element) {
  interact(element)
    .draggable({
      listeners: {
        end(event) {
          eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
        },
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: false,
        }),
      ],
      inertia: true, 
    })
    .on("dragmove", (event) => {
      const items = document.getElementsByClassName("selected");
      const { dx, dy } = event;

      const parseDataAxis = (target) => (axis) => parseFloat(target.getAttribute(`data-${axis}`));

      const translate = (target) => (x, y) => {
        target.style.webkitTransform = "translate(" + x + "px, " + y + "px)";
        target.style.transform = "translate(" + x + "px, " + y + "px)";
      };

      const updateAttributes = (target) => (x, y) => {
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
      };

      if (items.length > 0) {
        for (const item of items) {
          const x = parseDataAxis(item)("x") + dx;
          const y = parseDataAxis(item)("y") + dy;

          translate(item)(x, y);
          updateAttributes(item)(x, y);
        }
      } else {
        const { target } = event;
        const x = (parseDataAxis(target)("x") || 0) + dx;
        const y = (parseDataAxis(target)("y") || 0) + dy;

        translate(target)(x, y);
        updateAttributes(target)(x, y);
      }
    });
}

export { addInteract };
