import React from 'react'
import crown from "../../assets/icon/crown.svg"

interface Props {
	color: string
	hasKingIcon: boolean
	isSelected: boolean
}


const Checker: React.FC<Props> = ({ color, hasKingIcon, isSelected }) => {
	// const selectedStyle = isSelected ? "outline outline-4 outline-blue-600 outline-offset-2" : ""
	const selectedStyle = isSelected ? "outline outline-green-500 outline-4" : ""

	return (
		<div
			className={`
				w-24 h-24 border-4 border-black rounded-full cursor-pointer
				hover:outline hover:outline-blue-500 hover:outline-4 ${selectedStyle}
				flex justify-center items-center
			`}
			style={{ backgroundColor: color }}
		>
			{hasKingIcon && (
				<img className='w-16 h-16' src={crown} alt="king" />
			)}
		</div>
	)
}

export default Checker
