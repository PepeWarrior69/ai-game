

declare interface IChecker {
	playerNumber: number
	type: "default" | "king"
}

declare interface ICell {
	isPlayable: boolean
	checker: IChecker | null
}

declare type BoardType = Array<Array<ICell>>

