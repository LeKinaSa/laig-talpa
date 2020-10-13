const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order " + index);

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order " + index);

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order " + index);

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order " + index);

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order " + index);

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order " + index);

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("All parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");
        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {        
        var children = viewsNode.children;

        this.cameras = {};
        
        this.default = this.reader.getString(viewsNode, 'default');
        if (this.default == null) {
            this.onXMLError('Error Parsing Default View');
        }

        var default_camera_found = false;

        for(var i = 0; i < children.length; i++){
            var camera;
            // Get id of the current camera.
            var id = this.reader.getString(children[i], 'id');
            if (id == null)
                return "no ID defined for camera";

            // Checks for repeated IDs.
            if (this.cameras[id] != null)
                return "ID must be unique for each camera (conflict: ID = " + id + ")";
            

            // perspective or ortho
            if (children[i].nodeName == "perspective") {
                var near  = this.reader.getFloat(children[i], 'near');
                var far   = this.reader.getFloat(children[i], 'far');
                var angle = this.reader.getFloat(children[i], 'angle');

                if(isNaN(far)){
                    this.onXMLMinorError("enter a valid number for 'far'; using far = 500"); 
                    far = 500;
                } 
                if(isNaN(near)){
                    this.onXMLMinorError("enter a valid number for 'near'; using near = 0.1");
                    near = 0.1;
                } 
                if(isNaN(angle)){
                    this.onXMLMinorError("enter a valid number for 'angle'; using angle = 45");
                    angle = 45;
                } 

                angle = angle * DEGREE_TO_RAD;

                var grandChildren = children[i].children;
                var nodeNames = [];

                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                var fromID = nodeNames.indexOf('from');
                var from = [30, 15, 30];

                if (fromID == -1)
                    this.onXMLMinorError("unable to parse 'from' values, using [30, 15, 30]");
                else {
                    from[0] = this.reader.getFloat(grandChildren[fromID], 'x');
                    from[1] = this.reader.getFloat(grandChildren[fromID], 'y');
                    from[2] = this.reader.getFloat(grandChildren[fromID], 'z');

                    if (isNaN(from[0])) {
                        this.onXMLMinorError("enter a valid number for 'from[0]'; using from[0] = 30");
                        from[0] = 30;
                    }
                    if (isNaN(from[1])) {
                        this.onXMLMinorError("enter a valid number for 'from[1]'; using from[1] = 15");
                        from[1] = 15;
                    }
                    if (isNaN(from[2])) {
                        this.onXMLMinorError("enter a valid number for 'from[2]'; using from[2] = 30");
                        from[2] = 30;
                    }
                }

                var toID = nodeNames.indexOf("to");
                var to = [0, -2, 0];

                if (toID == -1)
                    this.onXMLMinorError("unable to parse 'to' values, using [0, -2, 0]");
                else {
                    to[0] = this.reader.getFloat(grandChildren[toID], 'x');
                    to[1] = this.reader.getFloat(grandChildren[toID], 'y');
                    to[2] = this.reader.getFloat(grandChildren[toID], 'z');

                    if (isNaN(to[0])) {
                        this.onXMLMinorError("enter a valid number for 'to[0]'; using to[0] = 0");
                        to[0] = 0;
                    }
                    if (isNaN(to[1])) {
                        this.onXMLMinorError("enter a valid number for 'to[1]'; using to[1] = -2");
                        to[1] = -2;
                    }
                    if (isNaN(to[2])) {
                        this.onXMLMinorError("enter a valid number for 'to[2]'; using to[2] = 0");
                        to[2] = 0;
                    }
                }

                var fromVector = vec3.fromValues(from[0], from[1], from[2]);
                let toVector = vec3.fromValues(to[0], to[1], to[2]);

                camera = new CGFcamera(angle, near, far, fromVector, toVector);

                this.log("Parsed Perspective Camera");
            }
            else if (children[i].nodeName == "ortho") {
                var near   = this.reader.getFloat(children[i], 'near');
                var far    = this.reader.getFloat(children[i], 'far');
                var left   = this.reader.getFloat(children[i], 'left');
                var right  = this.reader.getFloat(children[i], 'right');
                var top    = this.reader.getFloat(children[i], 'top');
                var bottom = this.reader.getFloat(children[i], 'bottom');

                if(isNaN(far)){
                    this.onXMLMinorError("enter a valid number for 'far'; using far = 100"); 
                    far = 100;
                } 
                if(isNaN(near)){
                    this.onXMLMinorError("enter a valid number for 'near'; using near = 0.2");
                    near = 0.2;
                } 
                if(isNaN(left)){
                    this.onXMLMinorError("enter a valid number for 'left'; using left = -0.2");
                    left = -0.2;
                } 
                if(isNaN(right)){
                    this.onXMLMinorError("enter a valid number for 'right'; using right = 0.2");
                    right = 0.2;
                } 
                if(isNaN(top)){
                    this.onXMLMinorError("enter a valid number for 'top'; using top = 0.2");
                    top = 0.2;
                } 
                if(isNaN(bottom)){
                    this.onXMLMinorError("enter a valid number for 'bottom'; using bottom = -0.2");
                    bottom = -0.2;;
                } 

                var grandChildren = children[i].children;
                var nodeNames = [];

                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                var fromID = nodeNames.indexOf('from');
                var from = [5, 0, 10];

                if (fromID == -1)
                    this.onXMLMinorError("unable to parse 'from' values, using [5, 0, 10]");
                else {
                    from[0] = this.reader.getFloat(grandChildren[fromID], 'x');
                    from[1] = this.reader.getFloat(grandChildren[fromID], 'y');
                    from[2] = this.reader.getFloat(grandChildren[fromID], 'z');

                    if(isNaN(from[0])) {
                        this.onXMLMinorError("enter a valid number for 'from[0]'; using from[0] = 5");
                        from[0] = 5;
                    }
                    if(isNaN(from[1])) {
                        this.onXMLMinorError("enter a valid number for 'from[1]'; using from[1] = 0");
                        from[1] = 0;
                    }
                    if(isNaN(from[2])) {
                        this.onXMLMinorError("enter a valid number for 'from[2]'; using from[2] = 10");
                        from[2] = 10;
                    }
                }

                var toID = nodeNames.indexOf("to");
                var to = [5, 0, 0];

                if (toID == -1) {
                    this.onXMLMinorError("unable to parse 'to' values, using [5, 0, 0]");
                }
                else{
                    to[0] = this.reader.getFloat(grandChildren[toID], 'x');
                    to[1] = this.reader.getFloat(grandChildren[toID], 'y');
                    to[2] = this.reader.getFloat(grandChildren[toID], 'z');

                    if(isNaN(to[0])) {
                        this.onXMLMinorError("enter a valid number for 'to[0]'; using to[0] = 5");
                        to[0] = 5;
                    }
                    if(isNaN(to[1])) {
                        this.onXMLMinorError("enter a valid number for 'to[1]'; using to[1] = 0");
                        to[1] = 0;
                    }
                    if(isNaN(to[2])) {
                        this.onXMLMinorError("enter a valid number for 'to[2]'; using to[2] = 0");
                        to[2] = 0;
                    }
                }

                var upID = nodeNames.indexOf("up");
                var up = [0, 1, 0];

                if (upID == -1)
                    this.onXMLMinorError("unable to parse 'to' values, using [0, 1, 0]");
                else {
                    up[0] = this.reader.getFloat(grandChildren[upID], 'x');
                    up[1] = this.reader.getFloat(grandChildren[upID], 'y');
                    up[2] = this.reader.getFloat(grandChildren[upID], 'z');

                    if (isNaN(up[0])) {
                        this.onXMLMinorError("enter a valid number for 'up[0]'; using up[0] = 0");
                        up[0] = 0;
                    }
                    if (isNaN(up[1])) {
                        this.onXMLMinorError("enter a valid number for 'up[1]'; using up[1] = 1");
                        up[1] = 1;
                    }
                    if (isNaN(up[2])) {
                        this.onXMLMinorError("enter a valid number for 'up[2]'; using up[2] = 0");
                        up[2] = 0;
                    }
                }

                var fromVector = vec3.fromValues(from[0], from[1], from[2]);
                var toVector   = vec3.fromValues(  to[0],   to[1],   to[2]);
                var upVector   = vec3.fromValues(  up[0],   up[1],   up[2]);

                camera = new CGFcamera(left, right, bottom, top, near, far, fromVector, toVector, upVector);

                this.log("Parsed Ortho Camera");
            }
            else
                return "Camera type " + children[i].nodeName + " is not accepted";
        

            this.cameras[id] = camera;

            if (id == this.default) {
                this.scene.camera = camera;
                this.scene.interface.setActiveCamera(camera);
                default_camera_found = true;
            }
        }

        if (!default_camera_found)
            return "Default View ID does not match a camera ID";

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");
        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        this.textures = [];

        for(var i = 0; i < texturesNode.children.length; i++){
            if(texturesNode.children[i].nodeName == "texture"){
                var textureID = this.reader.getString(texturesNode.children[i], 'id');
                var path = this.reader.getString(texturesNode.children[i], 'path');
            }
            else
                this.onXMLMinorError("unknown tag name <" + name + ">");

            var texture = new CGFtexture(this.scene, path);
            this.textures[textureID] = texture;
        }


        this.log("Parsed textures");
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            //Continue here
            var materialInfo = children[i].children;

            for(var j = 0; j < materialInfo.length; j++){
                nodeNames.push(materialInfo[j].nodeName);
            }

            console.log(materialID);

            var shininessIndex = nodeNames.indexOf("shininess");
            var ambientIndex   = nodeNames.indexOf("ambient");
            var diffuseIndex   = nodeNames.indexOf("diffuse");
            var specularIndex  = nodeNames.indexOf("specular");
            var emissiveIndex  = nodeNames.indexOf("emissive");

            // ------------------------------------- Shininess
            if(shininessIndex == -1) return " No value for shininess in material: " + materialID;
            var shininess = this.reader.getFloat(materialInfo[shininessIndex], 'value');
            if(isNaN(shininess) || shininess <= 0) return "Not a valid value for shininess in material: " + materialID;
                
            // ------------------------------------- Ambient
            if(ambientIndex == -1) return "No value for ambient in material: " + materialID;
            var ambient_component = [];

            // --- Ambient: Red
            var ambient_r = this.reader.getFloat(materialInfo[ambientIndex], 'r');
            if(isNaN(ambient_r) || ambient_r < 0 || ambient_r > 1) return "Not a valid value for ambient_red in material: " + materialID;
            ambient_component.push(ambient_r);

            // --- Ambient: Green
            var ambient_g = this.reader.getFloat(materialInfo[ambientIndex], 'g');
            if(isNaN(ambient_g) || ambient_g < 0 || ambient_g > 1) return "Not a valid value for ambient_green in material: " + materialID;
            ambient_component.push(ambient_g);

            // --- Ambient: Blue
            var ambient_b = this.reader.getFloat(materialInfo[ambientIndex], 'b');
            if(isNaN(ambient_b) || ambient_b < 0 || ambient_b > 1) return "Not a valid value for ambient_blue in material: " + materialID;
            ambient_component.push(ambient_b);

            // --- Ambient: A
            var ambient_a = this.reader.getFloat(materialInfo[ambientIndex], 'a');
            if(isNaN(ambient_a) || ambient_a < 0 || ambient_a > 1) return "Not a valid value for ambient_a in material: " + materialID;
            ambient_component.push(ambient_a);

            // ------------------------------------- Diffuse
            if(diffuseIndex == -1) return " No value for diffuse in material: " + materialID;
            var diffuse_component = [];

            // --- Diffuse: Red
            var diffuse_r = this.reader.getFloat(materialInfo[diffuseIndex], 'r');
            if(isNaN(diffuse_r) || diffuse_r < 0 || diffuse_r > 1) return "Not a valid value for diffuse_red in material: " + materialID;
            diffuse_component.push(diffuse_r);

            // --- Diffuse: Green
            var diffuse_g = this.reader.getFloat(materialInfo[diffuseIndex], 'g');
            if(isNaN(diffuse_g) || diffuse_g < 0 || diffuse_g > 1) return "Not a valid value for diffuse_green in material: " + materialID;
            diffuse_component.push(diffuse_g);

            // --- Diffuse: Blue
            var diffuse_b = this.reader.getFloat(materialInfo[diffuseIndex], 'b');
            if(isNaN(diffuse_b) || diffuse_b < 0 || diffuse_b > 1) return "Not a valid value for diffuse_blue in material: " + materialID;
            diffuse_component.push(diffuse_b);

            // --- Diffuse: A
            var diffuse_a = this.reader.getFloat(materialInfo[diffuseIndex], 'a');
            if(isNaN(diffuse_a) || diffuse_a < 0 || diffuse_a > 1) return "Not a valid value for diffuse_a in material: " + materialID;
            diffuse_component.push(diffuse_a);

            // ------------------------------------- Specular
            if(specularIndex == -1) return "No value for specular in material: " + materialID;
            var specular_component = [];

            // --- specular: Red
            var specular_r = this.reader.getFloat(materialInfo[specularIndex], 'r');
            if(isNaN(specular_r) || specular_r < 0 || specular_r > 1) return "Not a valid value for specular_red in material: " + materialID;
            specular_component.push(specular_r);

            // --- specular: Green
            var specular_g = this.reader.getFloat(materialInfo[specularIndex], 'g');
            if(isNaN(specular_g) || specular_g < 0 || specular_g > 1) return "Not a valid value for specular_green in material: " + materialID;
            specular_component.push(specular_g);

            // --- specular: Blue
            var specular_b = this.reader.getFloat(materialInfo[specularIndex], 'b');
            if(isNaN(specular_b) || specular_b < 0 || specular_b > 1) return "Not a valid value for specular_blue in material: " + materialID;
            specular_component.push(specular_b);

            // --- specular: A
            var specular_a = this.reader.getFloat(materialInfo[specularIndex], 'a');
            if(isNaN(specular_a) || specular_a < 0 || specular_a > 1) return "Not a valid value for specular_a in material: " + materialID;
            specular_component.push(specular_a);

            // ------------------------------------- Emissive
            if(emissiveIndex == -1) return "No value for emissive in material: " + materialID;
            var emissive_component = [];

            // --- Emissive: Red
            var emissive_r = this.reader.getFloat(materialInfo[emissiveIndex], 'r');
            if(isNaN(emissive_r) || emissive_r < 0 || emissive_r > 1) return "Not a valid value for emissive_red in material: " + materialID;
            emissive_component.push(emissive_r);

            // --- Emissive: Green
            var emissive_g = this.reader.getFloat(materialInfo[emissiveIndex], 'g');
            if(isNaN(emissive_g) || emissive_g < 0 || emissive_g > 1) return "Not a valid value for emissive_green in material: " + materialID;
            emissive_component.push(emissive_g);

            // --- Emissive: Blue
            var emissive_b = this.reader.getFloat(materialInfo[emissiveIndex], 'b');
            if(isNaN(emissive_b) || emissive_b < 0 || emissive_b > 1) return "Not a valid value for emissive_blue in material: " + materialID;
            emissive_component.push(emissive_b);

            // --- Emissive: A
            var emissive_a = this.reader.getFloat(materialInfo[emissiveIndex], 'a');
            if(isNaN(emissive_a) || emissive_a < 0 || emissive_a > 1) return "Not a valid value for emissive_a in material: " + materialID;
            emissive_component.push(emissive_a);

            var newMaterial = new CGFappearance(this.scene);
            newMaterial.setShininess(shininess);
            newMaterial.setAmbient(ambient_component[0],ambient_component[1],ambient_component[2],ambient_component[3]);
            newMaterial.setDiffuse(diffuse_component[0],diffuse_component[1],diffuse_component[2],diffuse_component[3]);
            newMaterial.setSpecular(specular_component[0],specular_component[1],specular_component[2],specular_component[3]);
            newMaterial.setEmission(emissive_component[0],emissive_component[1],emissive_component[2],emissive_component[3]);
            
            this.materials[materialID] = newMaterial;            
            
        }

        this.log("Parsed materials");
    }

        /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            // Creates node with information about the graph and it's ID
            this.nodes[nodeID] = new MyNode(this, nodeID);

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // -------------------- Transformations -------------------- 
            //                  MISSING: ERROR HANDLING

            var transformationsIndex = nodeNames.indexOf("transformations");

            var transformations = grandChildren[transformationsIndex].children;

            for(var j = 0; j < transformations.length; j++){
                switch(transformations[j].nodeName){
                    case "translation":
                        var x = this.reader.getFloat(transformations[j], 'x');
                        var y = this.reader.getFloat(transformations[j], 'y');
                        var z = this.reader.getFloat(transformations[j], 'z');
                        mat4.translate(this.nodes[nodeID].matrix, this.nodes[nodeID].matrix, [x, y, z])
                        break;
                    case "rotation":
                        var axis = this.reader.getItem(transformations[j], 'axis', ['x', 'y', 'z']);
                        var angle = this.reader.getFloat(transformations[j], 'angle');
                        mat4.rotate(this.nodes[nodeID].matrix, this.nodes[nodeID].matrix, angle * DEGREE_TO_RAD, this.axisCoords[axis]);
                        break;
                    case "scale":
                        var sx = this.reader.getFloat(transformations[j], 'sx');
                        var sy = this.reader.getFloat(transformations[j], 'sy');
                        var sz = this.reader.getFloat(transformations[j], 'sz');
                        mat4.scale(this.nodes[nodeID].matrix, this.nodes[nodeID].matrix, [sx, sy, sz]);
                        break;
                    default:
                        break;
                }
            }

            // -------------------- Material -------------------- 
            //                         DONE

            var materialIndex = nodeNames.indexOf("material");
            if(materialIndex == -1) return "Material must be defined for node: " + nodeID;

            var materialID = this.reader.getString(grandChildren[materialIndex], 'id');
            if(materialID == null) return "Can't parse materials for node: " + nodeID;
            if(materialID != "null" && this.materials[materialID] == null)
                return "Not a valid materialID for node: " + nodeID;

            this.nodes[nodeID].material = materialID;

            // -------------------- Texture -------------------- 
            //          NOT COMPLETED, MISSING AMPLIFICATIONS

            var textureIndex = nodeNames.indexOf("texture");

            //var amplifications = grandChildren[textureIndex].children;

            //var afs = this.reader.getFloat(amplifications[0], 'afs');
            //var aft = this.reader.getFloat(amplifications[0], 'aft');

            var textureID = this.reader.getString(grandChildren[textureIndex], 'id');
            
            this.nodes[nodeID].texture = textureID;
            

            // -------------------- Descendants -------------------- 
            //                         DONE

            var descendantsIndex = nodeNames.indexOf("descendants");

            // list where each element corresponds to a noderef or a leaf
            var descendants = grandChildren[descendantsIndex].children;

            // identify if it's a noderef or a leaf and treat them
            for(var j = 0; j < descendants.length; j++){
                if(descendants[j].nodeName == "noderef"){
                    var currentNodeID = this.reader.getString(descendants[j], 'id');

                    if(currentNodeID == null)
                        this.onXMLMinorError("Error: parse descendants - noderef");
                    else{
                        this.nodes[nodeID].addChild(currentNodeID);
                    }
                }
                else if(descendants[j].nodeName == "leaf"){
                    this.nodes[nodeID].addLeaf(new MyLeaf(this, descendants[j]));
                }
                else{
                    this.onXMLMinorError("unknown tag <" + descendants[j].nodeName + ">");
                }
            }

        }
    }


    parseBoolean(node, name, messageError){
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 1;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        
        //To do: Create display loop for transversing the scene graph, calling the root node's display function
        
        //this.nodes[this.idRoot].display()

        this.displaySceneRecursive(this.idRoot, this.nodes[this.idRoot].texture, this.nodes[this.idRoot].material);
    }

    // NOT COMPLETED, TEXTURES DONT WORK, MISSING AMPLIFICATIONS
    displaySceneRecursive(nodeID, textureFather, materialFather){
        var currentNode = this.nodes[nodeID];
        var idTexture = textureFather;
        var idMaterial = materialFather;

        this.scene.multMatrix(currentNode.matrix);

        if (this.materials[currentNode.material] != null) {
            idMaterial = currentNode.material;
        }

        if(this.textures[currentNode.texture] != null){
            if(currentNode.textureID == 'clear'){
                idTexture = null;
            }
            else
                idTexture = currentNode.texture;
        }

        var currentMaterial = this.materials[idMaterial];
        var currentTexture = this.textures[idTexture];
        

        for(var i = 0; i < currentNode.leaves.length; i++){
            
            if(currentNode.leaves[i].primitive != null){
                if(currentMaterial != null){
                    currentMaterial.apply();
                }
                if(currentTexture != null){
                    currentTexture.bind();
                }
                currentNode.leaves[i].primitive.display();
            }                
        }

        for(var i = 0; i < currentNode.children.length; i++){
            this.scene.pushMatrix();
            this.displaySceneRecursive(currentNode.children[i],idTexture, idMaterial);
            this.scene.popMatrix();
        }        
    }
}