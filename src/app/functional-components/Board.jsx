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
      let click = _.noop, inner = move

      if (move === null && !props.disabled) {
        const col = i
        click = e => {
          e.stopPropagation()
          props.onCellClicked(rowInd, col)
        }
      }

      const style = {
        'gridArea': `${rowInd + 1} / ${i + 1} / ${rowInd + 2} / ${i + 2}`,
        'color': 'black'//`${_.get(move, 'player.color')}`
      }

      cells.push(
        <div key={id} id={id} className='ttt-cell' onClick={click} style={style}>
          {inner}
        </div>
      )

      i++
    }

    return cells
}

const Board = props => {
  const style = {
    gridTemplateColumns: _.fill(Array(props.cols), '1fr').join(' '),
    gridTemplateRows: _.fill(Array(props.rows), '1fr').join(' '),
  }
  return (
    <div className='ttt-board' style={style}>
      {makeRows(props)}
    </div>
  )
}

export default Board;
