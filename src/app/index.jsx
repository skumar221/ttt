import React from 'react'
import {render} from 'react-dom'
import TicTacToe from "./components/TicTacToe.jsx"
import './less/TicTacToe.less'

class App extends React.Component {
  render () {
    return <TicTacToe />
  }
}

render(<App/>, document.getElementById('app'))
