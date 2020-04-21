import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import Main from './components/Main';

// import more components
export default (
    <HashRouter history={hashHistory}>
     <div>
      <Route path='/' component={Main} />
     </div>
    </HashRouter>
);