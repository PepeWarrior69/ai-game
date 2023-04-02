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
