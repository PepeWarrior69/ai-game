
export const getDeepCopy = (value: any) => {
	return JSON.parse(JSON.stringify(value))
}