declare interface IStrKeysDict<T> {
	[key: string]: T
}



declare interface IChecker {
	playerNumber: number
	type: "default" | "king"
}

declare interface ICell {
	isPlayable: boolean
	checker: IChecker | null
}

declare interface ICoordinates {
	row: number
	column: number
}

declare interface IChainElement {
	from: ICoordinates
	to: ICoordinates
	killed: ICoordinates | null
}

declare type CheckersMovesType = IStrKeysDict<IChainElement[][]>

declare interface IScore {
	"1": number
	"2": number
}

declare interface ICellInfo extends Pick<ICell, "checker"> {
	coordinates: ICoordinates
}

declare type GameStatusType = "pause" | "inProgress" | "finished" | null

declare type BoardType = Array<Array<ICell>>


declare interface IGameInfo {
	board: BoardType,
	score: IScore,
	currentPlayer: number,
	status: ISTatus,
	winner: number | null
}


declare interface IMove {
	from: ICellInfo | null
	to: ICellInfo | null
	prev: any
	next: any
}

declare interface IGameState {
	board: BoardType
	score: IScore
	nextMovesOwner: number
}
