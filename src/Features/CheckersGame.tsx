import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Checkers from '../Models/Checkers'

import Board from '../components/Board/Board'
import Score from '../components/Score/Score'
import PlayerToggle from '../components/PlayerToggle/PlayerToggle'
import GameControlButton from '../components/GameControlButton/GameControlButton'
import Bot from '../Models/Bot'
import Status from '../components/Status/Status'

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
	}, [refreshGameInfo])

	// useEffect(() => {
	// 	if (currentPlayer !== myPlayerNumber) return

	// 	const moves = checkersClient.getAllAvailableMovesForPlayer(myPlayerNumber)
	// 	console.log("aaaaaaaaaaa = ", moves)
	// 	setAvailableMoves(moves)
	// }, [checkersClient, currentPlayer, myPlayerNumber])


	const onClickCell = useCallback((incomingInfo: ICellInfo) => {
		if (incomingInfo.checker) {
			return setSelectedCheckerInfo(prev => {
				if (!incomingInfo || !prev) return incomingInfo

				const { row, column } = incomingInfo.coordinates

				if (row === prev.coordinates.row && column === prev.coordinates.column) {
					return null
				}

				return incomingInfo
			})
		}

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
	}, [])

	const onReset = useCallback(() => {
		checkersClient.resetGame(currentPlayer)

		refreshGameInfo()
	}, [checkersClient, currentPlayer, refreshGameInfo])

	const selectedCheckerMoves = useMemo(() => {
		if (!selectedCheckerInfo) return []

		const availableMoves = checkersClient.getAllAvailableMovesForPlayer(myPlayerNumber)
		const { row, column } = selectedCheckerInfo.coordinates

		const moves = availableMoves[`${myPlayerNumber}_${row}_${column}`]

		if (!moves) return []

		return moves.map(move => {
			const endpoint = move[move.length - 1].to

			return { row: endpoint.row, column: endpoint.column }
		})
	}, [selectedCheckerInfo, myPlayerNumber, checkersClient])

	return (
		<div className='w-full flex'>
			<Board
				board={board}
				selectedCheckerInfo={selectedCheckerInfo}
				selectedCheckerMoves={selectedCheckerMoves}
				onClickCell={onClickCell}
			/>

			<div className='ml-10 font-medium text-lg min-w-max'>
				<Status status={gameStatus} />

				<br/>

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
						onReset={onReset}
						onClick={onControlBtnClick}
					/>
				</div>
			</div>
		</div>
	)
}

export default CheckersGame
