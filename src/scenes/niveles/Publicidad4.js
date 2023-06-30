export class Publicidad4 {
    constructor(scene) {
        this.relatedScene = scene;
    }

    create() {
        this.relatedScene.video4.play();
        this.relatedScene.video4.visible = true;
        
        this.relatedScene.player.visible = false;
        this.relatedScene.ground.visible = false;
        this.relatedScene.balloon.visible = false;
        this.relatedScene.pregunta.visible = false;
        this.relatedScene.respuesta1.visible = false;
        this.relatedScene.respuesta2.visible = false;
        this.relatedScene.respuesta3.visible = false;
        this.relatedScene.opcionA.visible = false;
        this.relatedScene.opcionB.visible = false;
        this.relatedScene.opcionC.visible = false;

        setTimeout(() => {
            this.relatedScene.player.visible = true;
            this.relatedScene.ground.visible = true;
            this.relatedScene.balloon.visible = true;
            this.relatedScene.pregunta.visible = true;
            this.relatedScene.respuesta1.visible = true;
            this.relatedScene.respuesta2.visible = true;
            this.relatedScene.respuesta3.visible = true;
            this.relatedScene.opcionA.visible = true;
            this.relatedScene.opcionB.visible = true;
            if (this.relatedScene.item.respuesta.tres) {
                this.relatedScene.opcionC.visible = true;
            }

            this.relatedScene.video4.stop();
            this.relatedScene.video4.visible = false;

            this.relatedScene.niveles.nextLevel(false);
        }, 10000);
    }
}