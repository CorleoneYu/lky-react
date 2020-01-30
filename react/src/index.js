import App from './app';
import ReactDOM from './lib/react-dom';
import React from './lib/react';

window.addEventListener('load', function () { 
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  );
});
