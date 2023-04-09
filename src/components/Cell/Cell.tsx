import React from 'react'
import Checker from '../Checker/Checker'

interface Props {
	color: string
	checkerColor: "red" | "black" | null
	hasKingIcon: boolean
	isSelected: boolean
	isMarked: boolean
	onClick: () => void
}


const Cell: React.FC<Props> = ({
	color,
	checkerColor,
	hasKingIcon,
	isSelected,
	isMarked,
	onClick
}) => {
	const markedStyle = isMarked ? "cursor-pointer" : ""

	return (
		<div
			className={`
				flex justify-center items-center w-28 h-28 border-2 border-black
				relative ${markedStyle}
			`}
			style={{ backgroundColor: color }}
			onClick={onClick}
		>
			{isMarked && <div className='absolute w-4 h-4 bg-green-600 rounded-full'></div>}

			{checkerColor && (
				<Checker
					color={checkerColor}
					hasKingIcon={hasKingIcon}
					isSelected={isSelected}
				/>
			)}
		</div>
	)
}

export default Cell
