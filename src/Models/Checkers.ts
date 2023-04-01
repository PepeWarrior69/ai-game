const BOARD_SIZE = 8

class Checkers {
	private _board: Array<Array<ICell>> = []

	constructor() {
		this._generateBoard()
	}

	private _generateBoard() {
		let checkersCount = 12
		let playerNumber = 1

		for (let i = 0; i < BOARD_SIZE; i++) {
			const row: Array<ICell> = []

			let pawnIdx = (i + 1) % 2 // calculate start idx for checker based on current row

			for (let k = 0; k < BOARD_SIZE; k++) {
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

	private _isValidCoordinates(row: number, column: number) {
		return this._isValidIndex(row) && this._isValidIndex(column)
	}

	private _isValidMoveDirection(checker: IChecker, from: ICoordinates, to: ICoordinates) {
		if (checker.type === "king") return true

		if (checker.playerNumber === 1 && from.row < to.row) return true
		if (checker.playerNumber === 2 && from.row > to.row) return true

		return false
	}

	private _getDeepCopy(value: any) {
		return JSON.parse(JSON.stringify(value))
	}

	private _getCellsOccupiedByPlayer(playerNumber: number) {
		const playerOccupation: Array<{ rowIdx: number, cellIdx: number, checker: IChecker }> = []

		this._board.forEach((row, rowIdx) => {
			row.forEach((cell, cellIdx) => {
				if (cell.isPlayable && cell.checker && cell.checker.playerNumber === playerNumber) {
					playerOccupation.push({ rowIdx, cellIdx, checker: cell.checker })
				}
			})
		})

		return playerOccupation
	}

	/*
		enemy checker coords = { row: 4, column: 5 }
		ally checker coords = { row: 5, column: 4 }

		if "my checker column" is greater than "enemy checker column" then my column - 2 else + 2
		if "my checker row" is greater than "enemy checker row" them my row - 2 else + 2

		for player 1 increase row
		for player 2 decrease row

		also need to count allowed direction for any checker except that checker is king
		king can go in any direction
	*/

	private _getMovesForChecker(checker: IChecker, row: number, column: number, availableMovesChains: Array<Array<IChainElement>> = []) {
		const enemyOccupation: Array<ICoordinates> = []

		const currentCoordCell = this._board[row][column]
		const playerNumber = checker.playerNumber
		const coordinatesFrom = { row, column }

		// analyze closest cells
		for (let i = row - 1; i <= row + 1; i++) {
			for (let k = column - 1; k <= column + 1; k++) {
				if (!this._isValidCoordinates(i, k) || (i === row && k === column)) {
					continue
				}

				const cell = this._board[i][k]

				if (!cell.isPlayable) continue // skip unplayable cell

				const coordinates = { row: i, column: k }

				if (!this._isValidMoveDirection(checker, coordinatesFrom, coordinates)) continue // skip invalid move direction for checker

				if (!cell.checker) {
					// allow one step move only if at current coordinates we have the same checker (!!! recursive func usage issue !!!)
					if (currentCoordCell.checker === checker) {
						availableMovesChains.push([ { from: coordinatesFrom, to: coordinates } ])
					}
				} else if (cell.checker.playerNumber !== playerNumber) {
					enemyOccupation.push(coordinates)
				}
			}
		}

		enemyOccupation.forEach(enemyCoord => {
			const nextRow = row > enemyCoord.row ? row - 2 : row + 2
			const nextColumn = column > enemyCoord.column ? column - 2 : column + 2

			if (!this._isValidCoordinates(nextRow, nextColumn)) {
				return // skip if invalid next coordinates
			}

			if (this._board[nextRow][nextColumn].checker) {
				return // sjip if next cell is occupied
			}

			const existingChains = availableMovesChains.filter(ch => {
				const lastChainElem = ch[ch.length - 1]

				return lastChainElem.to.row === row && lastChainElem.to.column === column
			})

			const newChainElement = { from: coordinatesFrom, to: { row: nextRow, column: nextColumn } }

			if (existingChains.length < 1) {
				availableMovesChains.push([ newChainElement ]) // create new chain if there is no prev chain

				this._getMovesForChecker(checker, nextRow, nextColumn, availableMovesChains)
			} else {
				existingChains.forEach(chain => {
					const chainCopy: Array<IChainElement> = this._getDeepCopy(chain)

					// extend existing chain and add to list as possible moveset
					chainCopy.push(newChainElement)
					availableMovesChains.push(chainCopy)

					this._getMovesForChecker(checker, nextRow, nextColumn, availableMovesChains)
				})
			}
		})

		return availableMovesChains
	}

	/*
		PUBLIC SECTION
	*/

	public get board() {
		return this._getDeepCopy(this._board) // return copy of board state instead of reference to board
	}

	public getAllAvailableMovesForPlayer(playerNumber: number) {
		const playerOccupation = this._getCellsOccupiedByPlayer(playerNumber)
		const movesByCheckers: CheckersMovesType = {}

		playerOccupation.forEach(occ => {
			const { checker, rowIdx, cellIdx } = occ

			movesByCheckers[`${checker.playerNumber}_${rowIdx}_${cellIdx}`] = this._getMovesForChecker(checker, rowIdx, cellIdx)
		})

		return movesByCheckers
	}

	public makeMove(moveChain: Array<IChainElement>) {

	}


	// public setBoardCell(checker: IChecker, row: number, column: number) {
	// 	if (!this._isValidIndex(row)) throw new Error(`Invalid row value = ${row}. Must be between 0 and 7(included)`)
	// 	if (!this._isValidIndex(column)) throw new Error(`Invalid column value = ${column}. Must be between 0 and 7(included)`)
	// 	if (checker.figure !== null && ![ 0, 1, 2 ].includes(checker.figure)) throw new Error(`Invalid checker.figure = ${checker.figure}. Must be one of [ 0, 1, 2 ]`)

	// 	this._board[row][column] = JSON.parse(JSON.stringify(checker))
	// }
}

export default Checkers
