

class Node {
	private __boardState: Array<number>
	private _prev: Array<Node>
	private _next: Array<Node>
	private _hValue: number | null = null


	constructor (board: Array<number>, prev: Array<Node>, next: Array<Node>) {
		this.__boardState = board
		this._prev = prev
		this._next = next
	}

	/* GETTERS */

	public get values() {
		return this.__boardState
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

	/* SETTERS */

	public set values(board: Array<number>) {
		this.__boardState = board
	}

	public set prev(nodes: Array<Node>) {
		this._prev = nodes
	}

	public set next(nodes: Array<Node>) {
		this._next = nodes
	}

	public set hValue(val: number | null) {
		this._hValue = val
	}

}


export default Node
