import React from 'react';
import ReactDOM from 'react-dom';
import ListNews from './ListNews';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ListNews />, div);
});
