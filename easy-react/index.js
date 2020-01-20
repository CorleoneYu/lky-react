window.addEventListener('load', function () {
  class Button extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return React.createElement('button', { onClick: this.props.onClick }, `click Me`);
    }
  }
  const myBtn = React.createElement(Button, {onClick: () => alert('click me')}, null);

  ReactDOM.render(myBtn, document.getElementById('root'));
})