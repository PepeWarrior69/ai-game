import React from 'react'
import Cell from '../Cell/Cell'

interface Props {
	board: Array<Array<ICell>>
	setSelectedCheckerInfo: React.Dispatch<React.SetStateAction<ISelectedCheckerInfo | null>>
}


const Board: React.FC<Props> = ({ board, setSelectedCheckerInfo }) => {
	console.count("render Board")

	return (
		<div>
			<div className='grid grid-cols-8'>
				{board.map((row, rowIdx) => {
					return row.map((cell, colIdx) => {
						return (
							<Cell
								key={colIdx}
								color={(rowIdx + colIdx) % 2 === 0 ? "#d7a05a" : "#a26018"}
								checkerColor={!cell.isPlayable || !cell.checker ? null : cell.checker.playerNumber === 1 ? "red" : "black"}
								onClick={() => {
									if (!cell || !cell.checker || !cell.isPlayable) return

									setSelectedCheckerInfo({ checker: cell.checker, coordinates: { row: rowIdx, column: colIdx } })
								}}
							/>
						)
					})
				})}
			</div>
		</div>
	)

	// return (
	// 	<div className='flex justify-center flex-wrap'>
	// 		{board.map((row, rowIdx) => {
	// 			return (
	// 				<div
	// 					key={rowIdx}
	// 					className='flex'
	// 				>
	// 					{row.map((cell, cellIdx) => {
	// 						return (
	// 							<Cell
	// 								key={cellIdx}
	// 								color={(rowIdx + cellIdx) % 2 === 0 ? "#d7a05a" : "#a26018"}
	// 								checkerColor={!cell.isPlayable || !cell.checker ? null : cell.checker.playerNumber === 1 ? "red" : "black"}
	// 							/>
	// 						)
	// 					})}
	// 				</div>
	// 			)
	// 		})}
	// 	</div>
	// )
}

export default React.memo(Board)
