function createDiv(id, x, y, textSize, color, text = "") {
  const div = document.createElement("div");
  div.setAttribute("contenteditable", "true");
  div.setAttribute("id", id);
  div.setAttribute("data-x", 0);
  div.setAttribute("data-y", 0);
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.fontSize = textSize + "px";
  div.style.color = color;
  div.textContent = text;
  div.addEventListener("input", function (event) {
    eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
  });
  div.addEventListener("click", function (event) {
    event.target.setAttribute("contenteditable", "true");
    event.target.focus();
  });
  div.addEventListener("blur", function (event) {
    if (event.target.textContent === "") {
      event.target.remove();
    } else {
      event.target.setAttribute("contenteditable", "false");
      eventEmitter.emit(ACTIONS.TAKE_SNAPSHOT);
    }
  });
  setTimeout(function () {
    div.focus();
  }, 0);
  return div;
}

function resetAllEditableDivs() {
  document.querySelectorAll("div[contenteditable='true']").forEach((item) => {
    item.setAttribute("contenteditable", "false");
  });
}

export { createDiv, resetAllEditableDivs };
