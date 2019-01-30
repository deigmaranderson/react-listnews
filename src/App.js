import React from 'react';
import {
  Route,
  BrowserRouter,
  Switch
} from "react-router-dom";
import Detail from './Detail'
import ListNews from './ListNews'


class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
            <Route path='/' component={() => <ListNews />} />
            <Route path='/Detail/:id' component={() => <Detail />} />
        </Switch>
      </BrowserRouter>
    )
  }

}

export default App;
