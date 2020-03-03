import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Background from './Background'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('webgl'))
ReactDOM.render(<Background />, document.getElementById('background'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
