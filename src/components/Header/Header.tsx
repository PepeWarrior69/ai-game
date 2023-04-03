import React from 'react'

interface Props {

}


const Header: React.FC<Props> = () => {
	return (
		<div>
			<h1 className="text-3xl font-bold underline text-center">
				Checkers
			</h1>
		</div>
	)
}

export default React.memo(Header)
