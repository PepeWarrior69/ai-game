import Node from "./Node"

/*
	add node
*/



class Tree {
	private _root: Node | null
	private _nodes: Array<Node> = []

	constructor() {
		this._root = null
	}


	/* GETTERS */

	public get root() {
		return this._root
	}


	/* SETTERS */

	public set root(node: Node | null) {
		if (!node) return

		this._root = node
		this._nodes.push(node)
	}


	/* PUBLIC SECTION */

	public addNode() {

	}
}

export default Tree
