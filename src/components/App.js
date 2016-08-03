import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


const App = (props) => {
  return (
    <div>
      <ReactCSSTransitionGroup
        component="div"
        transitionName="fade"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        {React.cloneElement(props.children, {
          key: props.location.pathname
        })}
      </ReactCSSTransitionGroup>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
