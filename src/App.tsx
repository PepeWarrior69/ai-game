import React, { useCallback, useEffect, useRef, useState } from 'react'

import Header from './components/Header/Header'
import Checkers from './Models/Checkers'
import Board from './components/Board/Board'
import Score from './components/Score/Score'




const App: React.FC = () => {
	console.count("render App")
	const checkersGame = useRef(new Checkers(2))

	const [ board, setBoard ] = useState<ICell[][]>([])
	const [ myPlayerNumber ] = useState(checkersGame.current.takePlayerNumber("Player"))
	const [ gameStatus, setGameStatus ] = useState<GameStatusType>("pause")
	const [ currentPlayer, setCurrentPlayer ] = useState(myPlayerNumber)
	const [ score, setScore ] = useState<IScore>({ "1": 0, "2": 0 })
	const [ selectedCheckerInfo, setSelectedCheckerInfo ] = useState<ICellInfo | null>(null)
	const [ availableMoves, setAvailableMoves ] = useState<CheckersMovesType>({})

	const refreshGameInfo = useCallback(() => {
		const gameInfo = checkersGame.current.getGameInfo()

		setBoard(gameInfo.board)
		setCurrentPlayer(gameInfo.currentPlayer)
		setGameStatus(gameInfo.status)
		setScore(gameInfo.score)
	}, [])



	useEffect(() => {
		refreshGameInfo()
	}, [refreshGameInfo])

	useEffect(() => {
		if (currentPlayer !== myPlayerNumber) return

		const moves = checkersGame.current.getAllAvailableMovesForPlayer(myPlayerNumber)
		setAvailableMoves(moves)
	}, [currentPlayer, myPlayerNumber])


	const onClickCell = useCallback((incomingInfo: ICellInfo) => {
		if (incomingInfo.checker) return setSelectedCheckerInfo(incomingInfo)

		if (!selectedCheckerInfo) return

		const isMoved = checkersGame.current.makeMove(myPlayerNumber, selectedCheckerInfo, incomingInfo)

		if (isMoved) {
			setSelectedCheckerInfo(null)
			refreshGameInfo()
		}
	}, [selectedCheckerInfo, myPlayerNumber, refreshGameInfo])


	// const checkerMoves = useMemo(() => {
	// 	if (!selectedCheckerInfo || !availableMoves) return []

	// 	const { coordinates: { row, column } } = selectedCheckerInfo

	// 	return availableMoves[`${myPlayerNumber}_${row}_${column}`]
	// }, [selectedCheckerInfo, availableMoves, myPlayerNumber])


	return (
		<div className='flex justify-center h-screen'>
			<div className='container'>
				<Header/>

				<div className='flex mt-10'>
					<Board
						board={board}
						onClickCell={onClickCell}
					/>

					<div className=''>
						<Score score={score} />
					</div>
				</div>
			</div>
		</div>
	)
}


export default App
