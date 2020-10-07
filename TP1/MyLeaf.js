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
            case 'triangle':
                this.x1 = this.graph.reader.getString(element, 'x1');
                this.y1 = this.graph.reader.getString(element, 'y1');
                this.x2 = this.graph.reader.getString(element, 'x2');
                this.y2 = this.graph.reader.getString(element, 'y2');
                this.x3 = this.graph.reader.getString(element, 'x3');
                this.y3 = this.graph.reader.getString(element, 'y3');
                this.primitive = new MyTriangle(this.graph.scene, this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
                break;
            case 'sphere':
                this.radius = this.graph.reader.getString(element, 'radius');
                this.slices = this.graph.reader.getString(element, 'slices');
                this.stacks = this.graph.reader.getString(element, 'stacks');
                this.primitive = new MySphere(this.graph.scene, this.radius, this.slices, this.stacks);
                break;
            default:
                console.log("Not implemented yet");
                this.primitive = null;
                break;
        }

    }
}