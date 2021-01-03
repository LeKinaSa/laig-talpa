/**
* MyInterface class: creating a GUI interface
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor - Initializes the Interface
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
        this.gui = new dat.GUI();

        this.first_update = true;
        this.initKeys();        
        
        return true;
    }

    /**
     * Updates the GUI Interface
     * Once the scene has been initialized, it introduces the GUI interface for all the scene components.
     */
    update() {
        if ((this.scene.sceneInited) && (this.first_update)) {
            this.first_update = false;
            this.displayOptions();
            this.gameOptions();
        }
    }

    /**
     * Add a GUI interface for the cameras.
     */
    addCameras(folder) {
        folder.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Selected Camera').onChange(this.scene.updateCamera.bind(this.scene));
    }

    /**
     * Add a GUI interface for the lights.
     */
    addLights(folder) {
        for (let i = 0; i < this.scene.lights.length; i++) {
            if (this.scene.lights[i].key != null) {
                folder.add(this.scene.lights[i], 'enabled').name(this.scene.lights[i].key).onChange(this.scene.updateLights.bind(this.scene));
            }
        }
    }

    /**
     * Starts the Key Functions in the Interface.
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

    displayOptions(){
        const folder = this.gui.addFolder("Display Options");
        folder.open();
        this.addCameras(folder);
        this.addLights(folder);
        folder.add(this.scene, 'displayAxis').name("Display Axis");
        folder.add(this.scene, 'cameralock').name('Camera Lock');
        folder.add(this.scene, 'scaleFactor', 0.1, 10.0).name('Scale');

    }

    gameOptions(){
        const folder = this.gui.addFolder("Game Options");
        folder.open();
        folder.add(this.scene, 'timedGame').name('Timed Game').onChange(this.scene.changeTimed.bind(this.scene));
        folder.add(this.scene, 'selectedTheme', this.scene.gameScenes).name('Game Scene').onChange(this.scene.changeTheme.bind(this.scene));
        folder.add(this.scene, 'selectedDimension', this.scene.dimensions).name('Board Dimensions').onChange(this.scene.changeDimension.bind(this.scene));
        folder.add(this.scene, 'selectedRed', this.scene.redPlayer).name('Red Player').onChange(this.scene.changeRedPlayer.bind(this.scene));
        folder.add(this.scene, 'selectedBlue', this.scene.bluePlayer).name('Blue Player').onChange(this.scene.changeBluePlayer.bind(this.scene));
        folder.add(this.scene, 'movie').name('Movie');
        folder.add(this.scene, 'undo').name('Undo');
        folder.add(this.scene, 'restart').name('Restart');
    }
}
