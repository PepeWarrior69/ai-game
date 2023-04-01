import React, { useEffect, useMemo, useRef, useState } from 'react'

import Header from './components/Header/Header'
import Checkers from './Models/Checkers'
import Board from './components/Board/Board'
import Score from './components/Score/Score'


const App: React.FC = () => {
	console.count("render App")
	const checkersGame = useRef(new Checkers())

	const [ board, setBoard ] = useState(checkersGame.current.board)
	const [ started, setStarted ] = useState(false)
	const [ currentPlayer, setCurrentPlayer ] = useState(2)
	const [ score, setScore ] = useState<IScore>({ player1: 0, player2: 0 })
	const [ selectedCheckerInfo, setSelectedCheckerInfo ] = useState<ISelectedCheckerInfo | null>(null)
	const [ availableMoves, setAvailableMoves ] = useState<CheckersMovesType | null>(null)


	useEffect(() => {
		if (currentPlayer === 2) setAvailableMoves(checkersGame.current.getAllAvailableMovesForPlayer(2))
	}, [currentPlayer])


	const checkerMoves = useMemo(() => {
		if (!selectedCheckerInfo || !availableMoves) return []

		const { coordinates: { row, column } } = selectedCheckerInfo

		return availableMoves[`${2}_${row}_${column}`]
	}, [selectedCheckerInfo, availableMoves])


	return (
		<div className='flex justify-center h-screen'>
			<div className='container'>
				<Header/>

				<div className='flex mt-10'>
					<Board
						board={board}
						setSelectedCheckerInfo={setSelectedCheckerInfo}
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
