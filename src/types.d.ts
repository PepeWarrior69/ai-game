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
}

declare type CheckersMovesType = IStrKeysDict<IChainElement[][]>

declare interface IScore {
	player1: number
	player2: number
}

declare interface ISelectedCheckerInfo {
	checker: IChecker
	coordinates: ICoordinates
}