import Node from "./Node"

/*
	add node
*/



class Tree<T> {
	private _root: Node<T>
	private _nodes: Array<Node<T>> = []
	private _maxLevel: number
	private _count = 0

	constructor(initialState: T, maxlevel: number) {
		this._root = new Node(initialState, [], [], 0)
		this._maxLevel = maxlevel
	}


	/* GETTERS */

	public get root() {
		return this._root
	}


	/* SETTERS */

	// public set root(node: T | null) {
	// 	if (!node) return

	// 	this._root = new Node(node, [], [], 0)
	// 	this._nodes.push(this._root)
	// }

	public addNode(state: T, prev: T, next: T, level: number) {
		if (level > this._maxLevel) return false



		return true
	}

	public count() {
		this._count++
	}
}

export default Tree
