import Node from "./Node"

/*
	add node
*/



class Tree<T> {
	private _root: Node<T> | null = null
	private _nodes: Array<Node<T>> = []

	constructor() {
		this._root = null
	}


	/* GETTERS */

	public get root() {
		return this._root
	}


	/* SETTERS */

	public set root(node: Node<T> | null) {
		if (!node) return

		this._root = node
		this._nodes.push(node)
	}


	/* PUBLIC SECTION */

	public addNode() {

	}
}

export default Tree
