import { getDeepCopy } from "../utils"


const BOARD_SIZE = 8
const CHECKERS_COUNT = 12

class Checkers {
	private _board: BoardType = []
	private _status: GameStatusType = null
	private _currentPlayer = 2
	private _currentMoves: CheckersMovesType = {}
	private _score: IScore = { "1": 0, "2": 0 }
	private _winner: number | null = null
	private _gameListeners: IStrKeysDict<() => void> = {}

	constructor() {
		this._generateBoard()
	}

	private _generateBoard() {
		let checkersCount = CHECKERS_COUNT
		let playerNumber = 1

		for (let i = 0; i < BOARD_SIZE; i++) {
			const row: Array<ICell> = []

			let checkerIdx = (i + 1) % 2 // calculate start idx for checker based on current row

			for (let k = 0; k < BOARD_SIZE; k++) {
				if (checkerIdx === k) {
					if (checkersCount > 0) {
						checkersCount--

						row.push({ isPlayable: true, checker: { playerNumber, type: "default" } }) // set player checker
					} else {
						row.push({ isPlayable: true, checker: null }) // set neutral position which can be occupied by players checker
					}

					checkerIdx += 2
				} else {
					row.push({ isPlayable: false, checker: null }) // unplayable position
				}
			}

			this._board.push(row)

			// set second player checkers
			if (i === 4) {
				checkersCount = CHECKERS_COUNT
				playerNumber = 2
			}
		}
	}

	private _isValidPlayerNumber(num: number) {
		return [ 1, 2 ].includes(num)
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

	private _isOutOfMoves() {
		const playerMovesCount: IStrKeysDict<number> = {
			"1": 0,
			"2": 0
		}

		const keys = Object.keys(this._currentMoves)

		keys.forEach(key => {
			const playerNumber = key[0]

			playerMovesCount[playerNumber] += this._currentMoves[key].length
		})

		return playerMovesCount["1"] === 0 || playerMovesCount["2"] === 0
	}

	private _getCell(row: number, column: number) {
		if (!this._isValidCoordinates(row, column)) {
			throw new Error(`_getCell Invalid Coordinates row=${row}, column=${column}`)
		}

		return this._board[row][column]
	}

	private _composeMovesDictKey(playerNumber: number, row: number, column: number) {
		return `${playerNumber}_${row}_${column}`
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

	private _getMovesForChecker(checker: IChecker, row: number, column: number, availableMovesChains: Array<Array<IChainElement>> = [], count = 0) {
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
						availableMovesChains.push([ { from: coordinatesFrom, to: coordinates, killed: null } ])
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
				return // skip if next cell is occupied
			}

			const existingChains = availableMovesChains.filter(ch => {
				const lastChainElem = ch[ch.length - 1]

				return lastChainElem.to.row === row && lastChainElem.to.column === column
			})

			const newChainElement = {
				from: coordinatesFrom,
				to: { row: nextRow, column: nextColumn },
				killed: enemyCoord
			}

			if (existingChains.length < 1) {
				availableMovesChains.push([ newChainElement ]) // create new chain if there is no prev chain

				this._getMovesForChecker(checker, nextRow, nextColumn, availableMovesChains)
			} else {
				existingChains.forEach(chain => {
					// handle case when checker king can move in loop -> <- -> <-
					const prevChainElem = chain[chain.length - 1]
					if (prevChainElem.from.row === newChainElement.to.row && prevChainElem.from.column === newChainElement.to.column) {
						return
					}

					const chainCopy: Array<IChainElement> = getDeepCopy(chain)

					// extend existing chain and add to list as possible moveset
					chainCopy.push(newChainElement)
					availableMovesChains.push(chainCopy)

					this._getMovesForChecker(checker, nextRow, nextColumn, availableMovesChains)
				})
			}
		})

		return availableMovesChains
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

	private _setChecker(checker: IChecker | null, row: number, column: number) {
		const cell = this._getCell(row, column)

		if (!cell.isPlayable) {
			throw new Error(`_setChecker: Not playable cell row=${row}, column=${column}`)
		}

		this._board[row][column].checker = checker
	}

	private _toggleCurrentPlayer() {
		this._currentPlayer = this._currentPlayer === 1 ? 2 : 1
		this._calculatePlayerAvailableMoves()
	}

	private _updateCurrentMoves(playerNumber: number, moves: CheckersMovesType) {
		const keys = Object.keys(this._currentMoves)
		const oldPlayerMoveskeys = keys.filter(key => parseInt(key[0]) === playerNumber)

		oldPlayerMoveskeys.forEach(key => delete this._currentMoves[key]) // clear old moves

		this._currentMoves = { ...this._currentMoves, ...moves } // set new moves
	}

	private _calculatePlayerAvailableMoves() {
		const playerOccupation = this._getCellsOccupiedByPlayer(this._currentPlayer)
		const movesByCheckers: CheckersMovesType = {}

		playerOccupation.forEach(occ => {
			const { checker, rowIdx, cellIdx } = occ
			const key = this._composeMovesDictKey(checker.playerNumber, rowIdx, cellIdx)

			movesByCheckers[key] = this._getMovesForChecker(checker, rowIdx, cellIdx)
		})

		this._updateCurrentMoves(this._currentPlayer, movesByCheckers)
	}

	private _getSelectedMove(playerNumber: number, coordsFrom: ICoordinates, coordsTo: ICoordinates) {
		const key = this._composeMovesDictKey(playerNumber, coordsFrom.row, coordsFrom.column)
		const allCheckerMoves = this._currentMoves[key]

		if (!allCheckerMoves) return null

		return allCheckerMoves.find(move => {
			const moveFrom = move[0].from
			const moveTo = move[move.length - 1].to

			if (moveFrom.row === coordsFrom.row && moveFrom.column === coordsFrom.column) {
				if (moveTo.row === coordsTo.row && moveTo.column === coordsTo.column) {
					return true
				}
			}

			return false
		})
	}

	private _addScore() {
		if (this._currentPlayer === 1) {
			this._score["1"] += 1
		} else if (this._currentPlayer === 2) {
			this._score["2"] += 1
		}
	}

	// all listeners will now that something is updatedin game and they need to refresh game data
	private _triggerListeners() {
		Object.values(this._gameListeners).forEach(listener => listener())
	}

	/*
		PUBLIC SECTION
	*/


	public set status(st: GameStatusType) {
		this._status = st
		this._triggerListeners()
	}


	public setGameListener(playerNumber: number, listener: () => void) {
		if (!this._isValidPlayerNumber(playerNumber)) return false

		this._gameListeners[playerNumber] = listener
	}

	public getAllAvailableMovesForPlayer(playerNumber: number) {
		const movesByCheckers: CheckersMovesType = {}

		if (playerNumber !== this._currentPlayer) return movesByCheckers

		const keys = Object.keys(this._currentMoves)
		const playerKeys = keys.filter(key => parseInt(key[0]) === playerNumber)

		playerKeys.forEach(key => {
			movesByCheckers[key] = getDeepCopy(this._currentMoves[key])
		})

		return movesByCheckers
	}


	public makeMove(playerNumber: number, cellInfoFrom: ICellInfo, cellInfoTo: ICellInfo) {
		if (playerNumber !== this._currentPlayer || this._status !== "inProgress") return false

		const moveChain = this._getSelectedMove(playerNumber, cellInfoFrom.coordinates, cellInfoTo.coordinates)

		if (!moveChain) return false

		const { from } = moveChain[0] // first chain element
		const { to } = moveChain[moveChain.length - 1] // last chain element
		const cell = this._board[from.row][from.column]

		if (cell.checker?.playerNumber !== this._currentPlayer) {
			throw new Error("You can not move opponent checker")
		}

		const checker = cell.checker
		// need to handle king moves
		if ((playerNumber === 1 && to.row === 7) || (playerNumber === 2 && to.row === 0)) {
			checker.type = "king"
		}

		this._setChecker(checker, to.row, to.column)
		this._setChecker(null, from.row, from.column)

		moveChain.forEach(({ killed }) => {
			if (killed) {
				this._setChecker(null, killed.row, killed.column)

				this._addScore()
			}
		})

		this._winner = this._score[1] >= 12 ? 1 : this._score[2] >= 12 ? 2 : null
		if (this._winner !== null) this._status = "finished"
		else this._toggleCurrentPlayer()

		if (this._isOutOfMoves()) this._status = "finished"
		this._triggerListeners()

		return true
	}

	public takePlayerNumber(name: string) {
		return name === "bot" ? 1 : 2
	}

	public getGameInfo() {
		return {
			board: getDeepCopy(this._board) as BoardType,
			score: getDeepCopy(this._score) as IScore,
			currentPlayer: this._currentPlayer,
			status: this._status,
			winner: this._winner
		}
	}

	public start(startPlayerNumber: number) {
		if (!this._isValidPlayerNumber(startPlayerNumber)) {
			throw new Error("Invalid playerNumber value")
		}

		this._currentPlayer = startPlayerNumber
		this._status = "inProgress"
		this._calculatePlayerAvailableMoves()

		console.log("start startPlayerNumber = ", startPlayerNumber)

		this._triggerListeners()
	}

	public resetGame(startPlayerNumber: number) {
		this._board = []
		this._generateBoard()
		this._score[1] = 0
		this._score[2] = 0
		this._currentMoves = {}
		this._winner = null
		this.status = null
	}

	public getCell(row: number, column: number) {
		return getDeepCopy(this._board[row][column])
	}
}

export default Checkers
