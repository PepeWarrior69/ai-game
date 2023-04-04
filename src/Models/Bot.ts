import Checkers from "./Checkers";
import Node from "./Node";
import Tree from "./Tree";


const MAX_LEVEL = 6

class Bot {
	private _tree: Tree<IGameState>
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
			playerNumber: gameInfo.currentPlayer,
			cellInfoFrom: null,
			cellInfoTo: null
		}

		this._tree = new Tree(initialState, MAX_LEVEL)
		this._localGameClient = new Checkers()
		this._localGameClient.start(gameInfo.currentPlayer)

		console.time(`tree generation at level: ${MAX_LEVEL}`)
		this._generateGameTree()
		console.timeEnd(`tree generation at level: ${MAX_LEVEL}`)
		console.log("tree = ", this._tree)

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
	}

	private _makeMove() {
		const allMoves = this._checkersClient.getAllAvailableMovesForPlayer(this._playerNumber)

		const checkerMoves = Object.values(allMoves).find(moves => moves.length > 0)

		if (!checkerMoves) return

		const move = checkerMoves[0]
		const from = move[0].from
		const to = move[move.length - 1].to

		const cellFrom: ICellInfo = {
			checker: this._checkersClient.getCell(from.row, from.column).checker,
			coordinates: {
				row: from.row,
				column: from.column
			}
		}

		const cellTo: ICellInfo = {
			checker: this._checkersClient.getCell(to.row, to.column).checker,
			coordinates: {
				row: to.row,
				column: to.column
			}
		}

		this._checkersClient.makeMove(this._playerNumber, cellFrom, cellTo)
	}

	private _gameListener() {
		this._refreshGameInfo()
		this._makeMove()
	}

	private _generateGameTree(client = this._localGameClient, level = 1, prevNode = this._tree.root) {
		if (level >= MAX_LEVEL) return

		let actualgameInfo = client.getGameInfo()
		const checkersMoves = client.getAllAvailableMovesForPlayer(actualgameInfo.currentPlayer)

		Object.values(checkersMoves).forEach(moveSet => {
			if (moveSet.length < 1) return

			moveSet.forEach(chain => {
				const clientCopy = new Checkers(actualgameInfo) // init new game with previous states
				clientCopy.start(actualgameInfo.currentPlayer)

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

				clientCopy.makeMove(actualgameInfo.currentPlayer, cellFrom, cellTo)

				const info = clientCopy.getGameInfo()

				const state: IGameState = {
					board: info.board,
					score: info.score,
					playerNumber: info.currentPlayer,
					cellInfoFrom: cellFrom,
					cellInfoTo: cellTo
				}

				const node = new Node<IGameState>(state, [ prevNode ], [], level)
				prevNode.next.push(node)
				this._tree.count()
				this._generateGameTree(clientCopy, level + 1, node)
			})
		})
	}



}

export default Bot
