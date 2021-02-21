import './style.css';
import React from 'react';
import ReactDOM from 'react-dom';
 
class MyComponent extends React.Component {
  render() {
    return <div className="crazy">Hello React World</div>;
  }
}
 
ReactDOM.render(<MyComponent />, document.getElementById('chess-gui'));
