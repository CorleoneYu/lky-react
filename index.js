window.addEventListener('load', function () {
  const HelloV3 = function () {
    return React.createElement('div', null, 'Hello World V3.0');
  };

  const helloWorld1 = React.createElement(HelloV3, null, null);
  const helloWorld2 = React.createElement(HelloV3, null, null);
  const divEle = React.createElement('div', null, 'div tag');
  const parent = React.createElement('div', null, helloWorld1, helloWorld2, divEle, 'text content');

  ReactDOM.render(parent, document.getElementById('root'));
})