import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import Main from './components/Main';
import GameContainer from './components/GameContainer';

// import more components
export default (
    <HashRouter history={hashHistory}>
     <div>
      <Route exact path='/' component={Main} />
      <Route path='/game/:gameCode' component={GameContainer} />
     </div>
    </HashRouter>
);