import { ACTIONS } from "./actions";
import { eventEmitter } from "./EventEmitter";

function checkScrollDirection(event) {
  if (checkScrollDirectionIsUp(event)) {
    eventEmitter.emit(ACTIONS.INCREASE_FONT);
  } else {
    eventEmitter.emit(ACTIONS.DECREASE_FONT);
  }
}

function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}

export { checkScrollDirection };
