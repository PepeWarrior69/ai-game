import React from 'react'
import Cell from '../Cell/Cell'

interface Props {
	board: BoardType
	selectedCheckerInfo: ICellInfo | null
	selectedCheckerMoves: Array<ICoordinates>
	onClickCell: (info: ICellInfo) => void
}


const Board: React.FC<Props> = ({
	board,
	selectedCheckerInfo,
	selectedCheckerMoves,
	onClickCell
}) => {
	return (
		<div className='flex flex-wrap max-w-4xl'>
			{board.map((row, rowIdx) => {
				return (
					<div
						key={rowIdx}
						className='flex'
					>
						{row.map((cell, cellIdx) => {
							const isSelected = !!selectedCheckerInfo && selectedCheckerInfo.coordinates.row === rowIdx && selectedCheckerInfo.coordinates.column === cellIdx
							const isMarked = selectedCheckerMoves.findIndex(el => el.row === rowIdx && el.column === cellIdx) > -1

							return (
								<Cell
									key={cellIdx}
									color={(rowIdx + cellIdx) % 2 === 0 ? "#d7a05a" : "#a26018"}
									checkerColor={!cell.isPlayable || !cell.checker ? null : cell.checker.playerNumber === 1 ? "red" : "black"}
									hasKingIcon={cell.checker?.type === "king"}
									isSelected={isSelected}
									isMarked={isMarked}
									onClick={() => {
										if (!cell.isPlayable) return

										onClickCell({ checker: cell.checker, coordinates: { row: rowIdx, column: cellIdx } })
									}}
								/>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}

export default React.memo(Board)
