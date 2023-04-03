import React, { useRef } from 'react'

import Header from './components/Header/Header'
import Checkers from './Models/Checkers'
import CheckersGame from './Features/CheckersGame'
import Bot from './Models/Bot'


const App: React.FC = () => {
	const checkersGame = useRef(new Checkers())
	const checkersBot = useRef(new Bot(checkersGame.current))

	return (
		<div className='flex justify-center h-screen'>
			<div className='container'>
				<Header/>

				<div className='flex mt-10'>
					<CheckersGame
						checkersClient={checkersGame.current}
						checkersBot={checkersBot.current}
					/>
				</div>
			</div>
		</div>
	)
}


export default App
