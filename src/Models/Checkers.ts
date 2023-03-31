

class Checkers {
	private _board: BoardType = []

	constructor() {
		this._generateBoard()
	}

	private _generateBoard() {
		let checkersCount = 12
		let playerNumber = 1

		for (let i = 0; i < 8; i++) {
			const row: Array<ICell> = []

			let pawnIdx = (i + 1) % 2 // calculate start idx for checker based on current row

			for (let k = 0; k < 8; k++) {
				if (pawnIdx === k) {
					if (checkersCount > 0) {
						checkersCount--

						row.push({ isPlayable: true, checker: { playerNumber, type: "default" } }) // set player checker
					} else {
						row.push({ isPlayable: true, checker: null }) // set neutral position which can be occupied by players checker
					}

					pawnIdx += 2
				} else {
					row.push({ isPlayable: false, checker: null }) // unplayable position
				}
			}

			this._board.push(row)

			// set second player checkers
			if (i === 4) {
				checkersCount = 12
				playerNumber = 2
			}
		}
	}

	private _isValidIndex(idx: number) {
		return idx >= 0 && idx <= 7
	}

	private _getCellsOccupiedByPlayer(playerNumber: number) {
		const playerOccupation: Array<{ rowIdx: number, cellIdx: number, cell: ICell }> = []

		this._board.forEach((row, rowIdx) => {
			row.forEach((cell, cellIdx) => {
				if (cell.isPlayable && cell.checker && cell.checker.playerNumber === playerNumber) {
					playerOccupation.push({ rowIdx, cellIdx, cell })
				}
			})
		})

		return playerOccupation
	}

	public get board() {
		return JSON.parse(JSON.stringify(this._board)) // return copy of board state instead of reference to board
	}

	// public getAvailableMovesByCoordinates(row: number, column: number) {
	// 	const cell = this._board[row][column]

	// 	// if (!checker || !checker.figure) {
	// 	// 	throw new Error(`Invalid checker coordinates. row=${row}, column=${column}, checker=${checker}. Figure must be in [ 1, 2 ]`)
	// 	// }

	// 	// const moves = []


	// }

	public getAllAvailableMovesForPlayer(playerNumber: number) {
		const playerOccupation = this._getCellsOccupiedByPlayer(playerNumber)

		console.log("playerOccupation: ", playerOccupation)
	}


	// public setBoardCell(checker: IChecker, row: number, column: number) {
	// 	if (!this._isValidIndex(row)) throw new Error(`Invalid row value = ${row}. Must be between 0 and 7(included)`)
	// 	if (!this._isValidIndex(column)) throw new Error(`Invalid column value = ${column}. Must be between 0 and 7(included)`)
	// 	if (checker.figure !== null && ![ 0, 1, 2 ].includes(checker.figure)) throw new Error(`Invalid checker.figure = ${checker.figure}. Must be one of [ 0, 1, 2 ]`)

	// 	this._board[row][column] = JSON.parse(JSON.stringify(checker))
	// }
}

export default Checkers
