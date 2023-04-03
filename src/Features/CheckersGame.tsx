import React, { useCallback, useEffect, useState } from 'react'
import Checkers from '../Models/Checkers'

import Board from '../components/Board/Board'
import Score from '../components/Score/Score'
import PlayerToggle from '../components/PlayerToggle/PlayerToggle'
import GameControlButton from '../components/GameControlButton/GameControlButton'
import Bot from '../Models/Bot'

interface Props {
	checkersClient: Checkers
	checkersBot: Bot
}

const CheckersGame: React.FC<Props> = ({ checkersClient, checkersBot }) => {
	const [ board, setBoard ] = useState<ICell[][]>([])
	const [ myPlayerNumber ] = useState(checkersClient.takePlayerNumber("player"))
	const [ gameStatus, setGameStatus ] = useState<GameStatusType>("pause")
	const [ firstMove, setFirstMove ] = useState<"bot" | "player">("player")
	const [ currentPlayer, setCurrentPlayer ] = useState(myPlayerNumber)
	const [ score, setScore ] = useState<IScore>({ "1": 0, "2": 0 })
	const [ selectedCheckerInfo, setSelectedCheckerInfo ] = useState<ICellInfo | null>(null)
	// const [ availableMoves, setAvailableMoves ] = useState<CheckersMovesType>({})

	const refreshGameInfo = useCallback(() => {
		const gameInfo = checkersClient.getGameInfo()

		setBoard(gameInfo.board)
		setCurrentPlayer(gameInfo.currentPlayer)
		setGameStatus(gameInfo.status)
		setScore(gameInfo.score)
	}, [checkersClient])



	useEffect(() => {
		refreshGameInfo()
		console.log("initial set game info")
	}, [refreshGameInfo])

	useEffect(() => {
		if (currentPlayer !== myPlayerNumber) return

		// const moves = checkersClient.getAllAvailableMovesForPlayer(myPlayerNumber)
		// setAvailableMoves(moves)
	}, [checkersClient, currentPlayer, myPlayerNumber])


	const onClickCell = useCallback((incomingInfo: ICellInfo) => {
		if (incomingInfo.checker) return setSelectedCheckerInfo(incomingInfo)

		if (!selectedCheckerInfo) return

		const isMoved = checkersClient.makeMove(myPlayerNumber, selectedCheckerInfo, incomingInfo)

		if (isMoved) {
			setSelectedCheckerInfo(null)
			refreshGameInfo()
		}
	}, [checkersClient, selectedCheckerInfo, myPlayerNumber, refreshGameInfo])

	const onControlBtnClick = useCallback(() => {
		if (!gameStatus) {
			checkersClient.start(firstMove === "player" ? myPlayerNumber : checkersClient.takePlayerNumber("bot"))
		} else if (gameStatus === "inProgress") {
			checkersClient.status = "pause"
		} else if (gameStatus === "pause") {
			checkersClient.status = "inProgress"
		} else if (gameStatus === "finished") {
			checkersClient.resetGame(currentPlayer)
		}

		refreshGameInfo()
	}, [checkersClient, gameStatus, currentPlayer, firstMove, myPlayerNumber, refreshGameInfo])

	const onSelectFirstPlayer = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFirstMove(() => e.target.checked ? "bot" : "player")
		console.log("set ", e.target.checked ? "bot" : "player")
	}, [])

	return (
		<>
			<Board
				board={board}
				onClickCell={onClickCell}
			/>

			<div className='ml-10'>
				<Score score={score} />

				<div className='mt-5'>
					<PlayerToggle
						disabled={!!gameStatus && gameStatus !== "finished"}
						onCheck={onSelectFirstPlayer}
					/>
				</div>

				<div className='mt-5'>
					<GameControlButton
						disabled={false}
						status={gameStatus}
						onClick={onControlBtnClick}
					/>
				</div>
			</div>
		</>
	)
}

export default CheckersGame
