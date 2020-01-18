window.addEventListener('load', function () {
  const Hello = function () {
    return React.createElement('div', null, 'Hello World V2.0');
  };

  const helloWorld = React.createElement(Hello, null, null);
  ReactDOM.render(helloWorld, document.getElementById('root'));
})