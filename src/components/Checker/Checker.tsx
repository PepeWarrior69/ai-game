import React from 'react'

interface Props {
	color: string
}


const Checker: React.FC<Props> = ({ color }) => {
	return (
		<div
			className='
				w-28 h-28 border-4 border-black rounded-full cursor-pointer
				hover:outline hover:outline-blue-500 hover:outline-4
			'
			style={{ backgroundColor: color }}
		>
		</div>
	)
}

export default Checker
