import Checkers from "./Checkers";
import Tree from "./Tree";

/*
	Receive game client and also create his own game client for tree generation purpose
*/
class Bot {
	private _tree: Tree<BoardType>
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

		this._tree = new Tree()
		this._localGameClient = new Checkers()

		const gameInfo = checkersClient.getGameInfo()
		this._board = gameInfo.board
		this._score = gameInfo.score
		this._currentPlayer = gameInfo.currentPlayer
		this._status = gameInfo.status
		this._winner = gameInfo.winner

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
			checker: this._checkersClient.getCell(from.row, from.column),
			coordinates: {
				row: from.row,
				column: from.column
			}
		}

		const cellTo: ICellInfo = {
			checker: this._checkersClient.getCell(to.row, to.column),
			coordinates: {
				row: to.row,
				column: to.column
			}
		}

		this._checkersClient.makeMove(this._playerNumber, cellFrom, cellTo)
	}

	private _gameListener() {
		console.count("START BOT _gameListener")

		console.log("bot listen")
		console.log("bot this = ", this)
		this._refreshGameInfo()
		this._makeMove()

		console.count("END BOT _gameListener")
	}

	private _generateGameTree() {

	}



}

export default Bot
