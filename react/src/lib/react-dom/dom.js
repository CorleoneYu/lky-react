export function setAttribute(dom, key, value) {
  if (key === 'className') key = 'class';

  // 如果属性名是 onXXX 则是一个事件监听方法
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || '';
    return;
  }

  if (key === 'style') {
    if (!value || typeof value === 'string') {
      // style="color: white"
      dom.style.cssText = value || '';
      return;
    }

    if (value && typeof value === 'object') {
      // style={ color: "white" }
      for (let name in value) {
        const val = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
        dom.style[name] = val;
      }
      return;
    }
  }

  if (key in dom) {
    dom[key] = value || '';
  }

  if (value) {
    dom.setAttribute(key, value);
  } else {
    dom.removeAttribute(key);
  }
}