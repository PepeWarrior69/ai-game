import Node from "./Node"

/*
	add node
*/



class Tree<T, M> {
	private _root: Node<T, M>
	private _nodes: IStrKeysDict<Array<Node<T, M>>> = {}
	private _maxLevel: number
	private _count = 0

	constructor(initialState: T, maxlevel: number) {
		this._root = new Node(initialState, [], [], 0)
		this.addNode(this._root, 0)
		this._maxLevel = maxlevel
	}


	/* GETTERS */

	public get root() {
		return this._root
	}

	public get nodes() {
		return this._nodes
	}


	/* SETTERS */

	// public set root(node: T | null) {
	// 	if (!node) return

	// 	this._root = new Node(node, [], [], 0)
	// 	this._nodes.push(this._root)
	// }

	public addNode(node: Node<T, M>, level: number) {
		if (!this._nodes[level]) this._nodes[level] = []

		this._nodes[level].push(node)
	}

	public count() {
		this._count++
	}
}

export default Tree
