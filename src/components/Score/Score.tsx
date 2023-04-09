import React from 'react'

interface Props {
	score: IScore
}


const Score: React.FC<Props> = ({ score }) => {
	return (
		<div>
			<div>
				<label>Computer: <b>{score["1"]}</b></label>
			</div>
			<div>
				<label>Player: <b>{score["2"]}</b></label>
			</div>
		</div>
	)
}

export default React.memo(Score)
