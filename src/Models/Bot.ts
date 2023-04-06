import Checkers from "./Checkers";
import Node from "./Node";
import Tree from "./Tree";


const MAX_LEVEL = 5

class Bot {
	private _tree: Tree<IGameState, IMove>
	private _localGameClient: Checkers

	// REAL GAME START
	private _playerNumber: number
	private _checkersClient: Checkers
	private _board: BoardType
	private _score: IScore
	private _currentPlayer: number
	private _status: GameStatusType
	private _winner: number | null
	// REAL GAME END

	constructor(checkersClient: Checkers) {
		this._checkersClient = checkersClient

		const gameInfo = checkersClient.getGameInfo()
		this._board = gameInfo.board
		this._score = gameInfo.score
		this._currentPlayer = gameInfo.currentPlayer
		this._status = gameInfo.status
		this._winner = gameInfo.winner

		const initialState: IGameState = {
			board: gameInfo.board,
			score: gameInfo.score,
			nextMovesOwner: gameInfo.currentPlayer,
		}

		this._tree = new Tree(initialState, MAX_LEVEL)
		this._localGameClient = new Checkers()
		this._localGameClient.start(gameInfo.currentPlayer)
		this._playerNumber = checkersClient.takePlayerNumber("bot")

		this._gameListener = this._gameListener.bind(this)
		checkersClient.setGameListener(this._playerNumber, this._gameListener)
	}

	private _refreshGameInfo() {
		const gameInfo = this._checkersClient.getGameInfo()

		this._board = gameInfo.board
		this._score = gameInfo.score
		this._currentPlayer = gameInfo.currentPlayer
		this._status = gameInfo.status
		this._winner = gameInfo.winner

		return gameInfo
	}

	private _gameListener() {
		const gameInfo = this._refreshGameInfo()

		if (gameInfo.currentPlayer === this._playerNumber && !["finished", "pause", null].includes(this._status)) {
			this._localGameClient = new Checkers(gameInfo)
			this._localGameClient.start(gameInfo.currentPlayer)
			const initialState: IGameState = {
				board: gameInfo.board,
				score: gameInfo.score,
				nextMovesOwner: gameInfo.currentPlayer,
			}
			this._tree = new Tree(initialState, MAX_LEVEL)

			this._generateGameTree()
			this._minimax()
			this._makeMoveBasedOnTree()
		}
	}

	private _generateGameTree(client = this._localGameClient, level = 1, prevNode = this._tree.root) {
		if (level >= MAX_LEVEL) return

		let actualgameInfo = client.getGameInfo()
		const currentPlayer = actualgameInfo.currentPlayer
		const checkersMoves = client.getAllAvailableMovesForPlayer(currentPlayer)

		Object.values(checkersMoves).forEach(moveSet => {
			if (moveSet.length < 1) return

			moveSet.forEach(chain => {
				const clientCopy = new Checkers(actualgameInfo) // init new game with previous states
				clientCopy.start(currentPlayer)

				const from = chain[0].from
				const to = chain[chain.length - 1].to

				const cellFrom: ICellInfo = {
					checker: clientCopy.getCell(from.row, from.column).checker,
					coordinates: {
						row: from.row,
						column: from.column
					}
				}

				const cellTo: ICellInfo = {
					checker: clientCopy.getCell(to.row, to.column).checker,
					coordinates: {
						row: to.row,
						column: to.column
					}
				}

				if (!clientCopy.makeMove(currentPlayer, cellFrom, cellTo)) return

				const info = clientCopy.getGameInfo()

				const state: IGameState = {
					board: info.board,
					score: info.score,
					nextMovesOwner: info.currentPlayer
				}

				// search for existing node with the same board state
				const macthNode = this._findNode(state, level)
				const node = macthNode ? macthNode : new Node<IGameState, IMove>(state, [], [], level)

				const move: IMove = {
					from: cellFrom,
					to: cellTo,
					prev: prevNode,
					next: node
				}

				prevNode.next.push(move)
				node.prev.push(move)

				this._tree.count()
				this._tree.addNode(node, level)
				this._generateGameTree(clientCopy, level + 1, node)
			})
		})
	}

	private _findNode(state: IGameState, level: number) {
		if (!this._tree.nodes[level]) return null

		const match = this._tree.nodes[level].find(el => {
			return this._isSameBoards(el.state.board, state.board)
		})

		return match
	}

	private _isSameBoards(board1: BoardType, board2: BoardType) {
		for (let i = 0; i < board1.length; i++) {
			for (let k = 0; k < board1.length; k++) {
				const cell1 = board1[i][k]
				const cell2 = board2[i][k]

				if (!cell1.isPlayable && !cell2.isPlayable) continue // skip unplayable
				if (!cell1.checker && !cell2.checker) continue // skip if nothing to compare


				if (cell1.checker?.playerNumber !== cell2.checker?.playerNumber) {
					return false
				}

				if (cell1.checker?.type !== cell2.checker?.type) {
					return false
				}
			}
		}

		return true
	}

	private _getHValue(score: IScore) {
		let diff = Math.abs(score[1] - score[2])

		if (diff === 0) return diff

		if (score[1] > score[2]) {
			return diff
		}

		return -diff
	}

	private _minimax(node = this._tree.root, depth = MAX_LEVEL - 1, isMaximizer = true) {
		if (depth === 0 || Object.values(node.state.score).includes(12)) {
			const hValue = this._getHValue(node.state.score)

			node.hValue = hValue

			return node.hValue
		}

		if (isMaximizer) {
			let maxHValue = -Infinity

			node.next.forEach(move => {
				const hValue = this._minimax(move.next, depth - 1, false)

				maxHValue = Math.max(maxHValue, hValue)
			})

			node.hValue = maxHValue

			return maxHValue
		} else {
			let minHValue = +Infinity

			node.next.forEach(move => {
				const hValue = this._minimax(move.next, depth - 1, true)

				minHValue = Math.min(minHValue, hValue)
			})

			node.hValue = minHValue

			return minHValue
		}
	}

	private _makeMoveBasedOnTree() {
		const root = this._tree.root
		const maxHValue = root.hValue

		const match = root.next.find(move => move.next.hValue === maxHValue)

		if (match && match.from && match.to) {
			if (!this._checkersClient.makeMove(this._playerNumber, match.from, match.to)) {
				console.error("Invalid move in _makeMoveBasedOnTree")
				console.log("match = ", match)
				console.log("_playerNumber = ", this._playerNumber)
				console.log("=================================================")
			}
		} else {
			console.error("_makeMoveBasedOnTree: NO MATCH")
			console.log("match = ", match)
		}
	}

}

export default Bot
