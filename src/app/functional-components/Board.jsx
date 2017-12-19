import React from 'react'
import _ from 'lodash'

const makeRows = props => {
  let i = 0, rows = []
  while (i < props.rows) {
    rows.push(makeRow(props, i))
    i++
  }

  return rows
}

const makeRow = (props, rowInd) => {
    let i = 0, cells = []

    while (i < props.cols) {
      const id = `${rowInd}.${i}`
      const move = _.get(props.moves, id)
      let click = _.noop, inner = '   '

      if (!move) {
        const col = i
        click = e => {
          e.stopPropagation()
          props.onCellClicked(rowInd, col)
        }
      } else  {
        inner = _.get(move, 'value')
      }

      cells.push(
        <div key={id} id={id}
          className='ttt-cell'
          onClick={click}>
          <div className='ttt-cell-inner'>
            {inner}
          </div>

        </div>
      )

      i++
    }

    return (
      <div className='ttt-row' key={`Row${rowInd}`}>
        {cells}
      </div>
    )
}

const Board = props => (
 <div className='ttt-board'>
   {makeRows(props)}
 </div>
)

export default Board;
