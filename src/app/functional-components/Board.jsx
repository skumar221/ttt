import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

/**
* Returns all of the boards elements via the makeRow function.
*
* @param {object} props
*
* @return {array<array<React.Element>>}
*/
const makeRows = props => {
  let i = 0, rows = []
  while (i < props.rows) {
    rows.push(makeRow(props, i))
    i++
  }

  return rows
}

/**
* Returns a row element with cells, populated and unpopulated.
*
* @param {object} props
* @param {number} rowInd
*
* @return {array<React.Element>}
*/
const makeRow = (props, rowInd) => {
    let i = 0, cells = []

    while (i < props.cols) {
      const id = `${rowInd}.${i}`,
        move = _.get(props.moves, id),
        player = _.get(props.players, `${move}`)

      let click = _.noop,
        inner = '',
        isHint = false

      if (move === null && !props.disabled) {
        const col = i
        click = e => {
          e.stopPropagation()
          props.onCellClicked(rowInd, col)
        }

        // maybe show the bint
        if (props.hint) {
          const hintCol = _.get(props.hint, 'col')
          const hintRow = _.get(props.hint, 'row')

          if (hintCol === i && hintRow == rowInd) {
            inner = _.get(_.get(props.players, _.get(props.hint, 'player')), `symbol`)
            isHint = true
          }
        }

      } else if (move !== null) {
        inner = _.get(player, `symbol`)
      }

      let style = {
        'gridArea': `${rowInd + 1} / ${i + 1} / ${rowInd + 2} / ${i + 2}`,
      }

      if (!isHint) {
        style.color = `${_.get(player, `color`)}`
      }

      let className = 'ttt-cell'
      if (isHint) {
        className += ' hint-jitter'
      }

      // Win animation
      if (props.winSet && props.winSet[rowInd][i]) {
        className += ' win-jitter'
      }

      cells.push(
        <div key={id} id={id} className={className} onClick={click} style={style}>
          {inner}
        </div>
      )

      i++
    }

    return cells
}

/**
* Functional component representing the TTT board
*/
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

Board.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
  moves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  disabled: PropTypes.bool,
  players: PropTypes.object,
  onCellClicked: PropTypes.func,
  winSet: PropTypes.array, // or null
  hint: PropTypes.object
}

export default Board;
