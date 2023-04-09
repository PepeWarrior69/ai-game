import React from 'react'

interface Props {
	status: GameStatusType
	disabled?: boolean
	onClick: () => void
	onReset: () => void
}

const GameControlButton: React.FC<Props> = ({
	status,
	disabled=false,
	onClick,
	onReset
}) => {
	return (
		<>
			<button
				disabled={disabled}
				className="
					relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group
					bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4
					focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800
				"
				onClick={onClick}
			>
				<span
					className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
				>
					{!status ? "Start" : status === "inProgress" ? "Pause" : status === "pause" ? "Play" : "Play Again"}
				</span>
			</button>

			<button
				type="button"
				className="
					focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
					dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900
				"
				onClick={onReset}
			>
				Reset
			</button>
		</>
	)
}

export default GameControlButton
