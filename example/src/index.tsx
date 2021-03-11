import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import IndexPage from '~/pages/index';
import Basic from '~/pages/Basic';
import SetBound from '~/pages/SetBound';
import VerticalResize from '~/pages/VerticalResize';
import Lazy from '~pages/Lazy';
import * as Routes from '~common/routes';

const App = () => {
  return (
    <Router>
      <Route exact path={Routes.HOME} component={IndexPage} />
      <Route exact path={Routes.BASIC} component={Basic} />
      <Route exact path={Routes.VERTICAL_RESIZE} component={VerticalResize} />
      <Route exact path={Routes.SET_BOUND} component={SetBound} />
      <Route exact path={Routes.LAZY} component={Lazy} />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));