import React, { useEffect, useRef, useState } from 'react'
import Checkers from './Models/Checkers'
import Board from './components/Board/Board'


const App: React.FC = () => {
	const game = useRef(new Checkers())

	const [ board, setBoard ] = useState(game.current.board)

	useEffect(() => {
		console.log("game = ", game)

		const board = game.current.board

		game.current.getAllAvailableMovesForPlayer(2)
	}, [])

	return (
		<div className='flex justify-center h-screen'>
			<div className='container'>
				<h1 className="text-3xl font-bold underline text-center">
					Checkers
				</h1>

				<div className='mt-10'>
					<Board board={board}/>
				</div>
			</div>
		</div>
	)
}


export default App
