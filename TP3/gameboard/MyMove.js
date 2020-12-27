class MyMove extends CGFobject{
    constructor(scene, initialGameState, player, originTile, destinationTile){
        super(scene);
        this.initialGameState = initialGameState;
        this.player = player;
        this.originTile = originTile;
        this.destinationTile = destinationTile;
    }
}
