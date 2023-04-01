import React from 'react'
import Checker from '../Checker/Checker'

interface Props {
	color: string
	checkerColor: "red" | "black" | null
	onClick: () => void
}


const Cell: React.FC<Props> = ({ color, checkerColor, onClick }) => {
	return (
		<div
			className='flex justify-center items-center w-32 h-32 border-2 border-black'
			style={{ backgroundColor: color }}
			onClick={onClick}
		>
			{checkerColor && (
				<Checker
					color={checkerColor}
				/>
			)}
		</div>
	)
}

export default Cell
