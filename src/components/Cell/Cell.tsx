import React from 'react'
import Checker from '../Checker/Checker'

interface Props {
	color: string
	checkerColor: "red" | "black" | null
	checker?: IChecker | null
	onClick: () => void
}


const Cell: React.FC<Props> = ({ color, checkerColor, checker, onClick }) => {
	return (
		<div
			className='flex justify-center items-center w-32 h-32 border-2 border-black'
			style={{ backgroundColor: color }}
			onClick={onClick}
		>
			{checkerColor && (
				<Checker
					color={checkerColor}
					isKing={checker?.type === "king"}
				/>
			)}
		</div>
	)
}

export default Cell
