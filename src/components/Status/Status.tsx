import React from 'react'

interface Props {
	status: GameStatusType
}

const Status: React.FC<Props> = ({ status }) => {
	return (
		<>
			<div>
				<label>
					Game Status: <b>{!status ? "-" : status}</b>
				</label>
			</div>

			{/* <div>
				<label>
					Bot Status: <b>{!status ? "-" : status}</b>
				</label>
			</div> */}
		</>
	)
}

export default Status
