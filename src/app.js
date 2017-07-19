require('./style.css');
require('./style.scss');
require('./modulo1');
require('./modulo3');

console.log("Hola diego con recarga automatica y con quiet");

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    <h1>Hello World from React from web server!</h1>,
    document.getElementById('root')
);