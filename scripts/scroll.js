import { ACTIONS } from "./actions";
import { eventEmitter } from "./EventEmitter";

function onScroll(event) {
  if (checkScrollDirectionIsUp(event)) {
    eventEmitter.emit(ACTIONS.SCROLL_END, {direction: "up"});
  } else {
    eventEmitter.emit(ACTIONS.SCROLL_END, {direction: "down"});
  }
}

function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}

export { onScroll };
