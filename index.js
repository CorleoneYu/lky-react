window.addEventListener('load', function () {
  class Hello {
    render() {
      return React.createElement('div', null, 'class component');
    }
  }
  const helloWorld = React.createElement(Hello, null, null);
  ReactDOM.render(helloWorld, document.getElementById('root'));
})