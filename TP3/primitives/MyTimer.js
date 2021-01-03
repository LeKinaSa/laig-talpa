/**
 * MyTimer
 * Uses MySpriteText to Represent Time
 */
class MyTimer {
    constructor(scene) {
        this.scene = scene;
        //this.spriteText = new MySpriteText(this.scene, "");
    }

    getTime(time) {
        var minutesInt = Math.floor(time / 60);
        var secondsInt = Math.floor(time) % 60;

        var minutesStr = "00" + minutesInt.toString();
        var secondsStr = "00" + secondsInt.toString();

        var minutes = minutesStr.substring(minutesStr.length - 2, minutesStr.length);
        var seconds = secondsStr.substring(secondsStr.length - 2, secondsStr.length)

        var timeStr = minutes + ":" + seconds;
        return timeStr;
    }

/*     display(time) {
        var timeStr = this.getTime(time);
        this.spriteText.text = timeStr;

        this.scene.pushMatrix();

        this.scene.translate(-4.5, 1.5, 0);
        this.scene.scale(1.5, 1.5, 1.5);
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI/2, 0, 1, 0);

        this.spriteText.display();

        this.scene.popMatrix();
    } */
}