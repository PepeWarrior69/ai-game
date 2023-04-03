import React from 'react'
import crown from "../../assets/icon/crown.svg"

interface Props {
	color: string
	isKing: boolean
}


const Checker: React.FC<Props> = ({ color, isKing }) => {
	return (
		<div
			className='
				w-28 h-28 border-4 border-black rounded-full cursor-pointer
				hover:outline hover:outline-blue-500 hover:outline-4
				flex justify-center items-center
			'
			style={{ backgroundColor: color }}
		>
			{isKing && (
				<img className='w-20 h-20' src={crown} alt="king" />
			)}
		</div>
	)
}

export default Checker
