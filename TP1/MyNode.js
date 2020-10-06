/**
 * MyNode class: represents a node from the graph
 * @constructor
**/
class MyNode {

    constructor(graph, nodeID) {
        this.graph = graph;
        this.nodeID = nodeID;
        this.children = [];
        this.leaves = [];

        console.log("Node: " + nodeID);

    /*  this.material = null;
        this.texture = null;

        this.matrix = mat4.create();
        mat4.identity(this.matrix); */
    }
    // add a child identified by leaf
    addLeaf(leaf){
        this.leaves.push(leaf);
    }

    // add a child identified by nodeID
    addChild(nodeID) {
        this.children.push(nodeID);
    }

}

    