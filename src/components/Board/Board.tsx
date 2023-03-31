import React from 'react'
import Cell from '../Cell/Cell'

interface Props {
	board: BoardType
}


const Board: React.FC<Props> = ({ board }) => {
	return (
		<div className='flex justify-center flex-wrap'>
			{board.map((row, rowIdx) => {
				return (
					<div
						key={rowIdx}
						className='flex'
					>
						{row.map((cell, cellIdx) => {
							return (
								<Cell
									key={cellIdx}
									color={(rowIdx + cellIdx) % 2 === 0 ? "#d7a05a" : "#a26018"}
									checkerColor={!cell.isPlayable || !cell.checker ? null : cell.checker.playerNumber === 1 ? "red" : "black"}
								/>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}

export default Board
