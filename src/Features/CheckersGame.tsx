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
	console.count("render CheckersGame")

	const [ board, setBoard ] = useState<ICell[][]>([])
	const [ myPlayerNumber ] = useState(checkersClient.takePlayerNumber("Player"))
	const [ gameStatus, setGameStatus ] = useState<GameStatusType>("pause")
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
			checkersClient.start(currentPlayer)
		} else if (gameStatus === "inProgress") {
			checkersClient.status = "pause"
		} else if (gameStatus === "pause") {
			checkersClient.status = "inProgress"
		}

		refreshGameInfo()
	}, [checkersClient, gameStatus, currentPlayer, refreshGameInfo])

	const onSelectFirstPlayer = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentPlayer(() => e.target.checked ? 1 : 2)
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
						disabled={!!gameStatus}
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
