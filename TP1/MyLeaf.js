/**
 * MyLeaf class: represents the possible primitives (leaves)
 * @constructor
**/
class MyLeaf {

    constructor(graph, element) {
        this.graph = graph;
        this.primitive = null;

        // gets the type of the primitive from the xml file
        var type = this.graph.reader.getItem(element, 'type', ['rectangle', 'torus', 'triangle', 'sphere', 'cylinder']);
        console.log("Leaf: " + type);
        
        // switch to decide what primitive is going to be shown in the screen
        switch(type){
            case 'rectangle':
                this.x1 = this.graph.reader.getString(element, 'x1');
                this.y1 = this.graph.reader.getString(element, 'y1');
                this.x2 = this.graph.reader.getString(element, 'x2');
                this.y2 = this.graph.reader.getString(element, 'y2');
                this.primitive = new MyRectangle(this.graph.scene, this.x1, this.y1, this.x2, this.y2);
                break;
            default:
                console.log("Not implemented yet");
                this.primitive = null;
                break;
        }

    }
}