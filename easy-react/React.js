function createElement(parentEle, props, ...children) {
  if (typeof parentEle === 'function' && /^\s*class\s+/.test(parentEle.toString())) {
    const component = new parentEle();
    return component.render();
  }

  if (typeof parentEle === 'function') {
    return parentEle(props);
  }

  const parentElement = document.createElement(parentEle);
  children.forEach(child => {
    if (typeof child === 'string') {
      parentElement.innerHTML += child;
      return;
    }

    if (typeof child === 'object') {
      parentElement.appendChild(child);
      return;
    }
  });
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