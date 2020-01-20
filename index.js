window.addEventListener('load', function () {
  const Hello = ({name}) => {
    return React.createElement('div', null, `Hello ${name}`);
  };

  const helloWorld = React.createElement(Hello, { name: 'World' }, null);
  ReactDOM.render(helloWorld, document.getElementById('root'));
})