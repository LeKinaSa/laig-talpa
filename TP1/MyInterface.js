/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        this.gui.add(this.scene, 'displayAxis').name("Display Axis");
        this.gui.add(this.scene, 'scaleFactor', 0.1, 10.0).name('Scale');

        this.first_update = true;

        return true;
    }

    update() {
        if ((this.scene.sceneInited) && (this.first_update)) {
            this.first_update = false;

            this.gui.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Selected Camera').onChange(this.scene.updateCamera.bind(this.scene));

            for (let i = 0; i < this.scene.lights.length; i++) {
                if (this.scene.lights[i].key != null) {
                    console.log(this.scene.lights[i].key, this.scene.lights[i].enabled);

                    this.gui.add(this.scene.lights[i], 'enabled').name("Enable " + this.scene.lights[i].key);
                }
            }
        }
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}