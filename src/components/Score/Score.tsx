import React from 'react'

interface Props {
	score: IScore
}


const Score: React.FC<Props> = ({ score }) => {
	console.count("render Score")

	return (
		<div className=''>
			<div>
				<label>Computer: {score["1"]}</label>
			</div>
			<div>
				<label>Player: {score["2"]}</label>
			</div>
		</div>
	)
}

export default React.memo(Score)
