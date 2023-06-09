export class Publicidad3 {
    constructor(scene) {
        this.relatedScene = scene;
    }

    create() {
        this.relatedScene.video2.play();
        this.relatedScene.video2.visible = true;
        
        this.relatedScene.player.visible = false;
        this.relatedScene.ground.visible = false;
        this.relatedScene.balloon.visible = false;
        this.relatedScene.pregunta.visible = false;
        this.relatedScene.respuesta1.visible = false;
        this.relatedScene.respuesta2.visible = false;
        this.relatedScene.respuesta3.visible = false;

        setTimeout(() => {
            this.relatedScene.player.visible = true;
            this.relatedScene.ground.visible = true;
            this.relatedScene.balloon.visible = true;
            this.relatedScene.pregunta.visible = true;
            this.relatedScene.respuesta1.visible = true;
            this.relatedScene.respuesta2.visible = true;
            this.relatedScene.respuesta3.visible = true;

            this.relatedScene.video2.stop();
            this.relatedScene.video2.visible = false;

            this.relatedScene.niveles.nextLevel(false);
        }, 31000);
    }
}