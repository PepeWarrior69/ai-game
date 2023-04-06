
export const getDeepCopy = (value: any) => {
	return JSON.parse(JSON.stringify(value))
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
