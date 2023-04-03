
export const getDeepCopy = (value: any) => {
	console.log("getDeepCopy value = ", value)

	return JSON.parse(JSON.stringify(value))
}