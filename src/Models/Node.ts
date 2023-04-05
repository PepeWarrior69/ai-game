

class Node<T, M> {
	private _state: T
	private _prev: Array<M>
	private _next: Array<M>
	private _level: number
	private _hValue: number | null = null


	constructor(state: T, prev: Array<M>, next: Array<M>, level: number) {
		this._state = state
		this._prev = prev
		this._next = next
		this._level = level
	}

	/* GETTERS */

	public get state() {
		return this._state
	}

	public get prev() {
		return this._prev
	}

	public get next() {
		return this._next
	}

	public get hValue() {
		return this._hValue
	}

	public get level() {
		return this._level
	}

	/* SETTERS */

	public set state(board: T) {
		this._state = board
	}

	public set prev(nodes: Array<M>) {
		this._prev = nodes
	}

	public set next(nodes: Array<M>) {
		this._next = nodes
	}

	public set hValue(val: number | null) {
		this._hValue = val
	}

	public set level(val: number) {
		this._level = val
	}

}


export default Node
