function createElement(parentEle, props, childEle) {
  const parentElement = document.createElement(parentEle);
  parentElement.innerHTML = childEle;
  return parentElement;
}

function render(insertEle, rootEle) {
  rootEle.appendChild(insertEle);
}

window.React = {
  createElement,
}

window.ReactDOM = {
  render,
}