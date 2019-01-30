import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 
import {
  Route,
  Switch,
  BrowserRouter,
} from "react-router-dom";

import Detail from './components/detail/Detail'
import ListNews from './components/list/ListNews'

ReactDOM.render(
    <BrowserRouter>
      <Switch>
          <Route exact path='/' component={() => <ListNews />} />
            <Route path='/Detail/:id' component={() => <Detail />} />
      </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
     