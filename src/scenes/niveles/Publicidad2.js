export class Publicidad2 {
    constructor(scene) {
        this.relatedScene = scene;
    }

    preload() {
        
    }

    create() {
        this.relatedScene.bg_audio.pause();
        this.relatedScene.video2 = this.relatedScene.add.video(this.relatedScene.cameras.main.width / 2, window.innerHeight * 0.5, 'videoPublicidad2').setScale(window.innerWidth * 0.0014, window.innerHeight * 0.0008).setDepth(2);
        this.relatedScene.video2.play();
        this.relatedScene.video2.visible = true;

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
        this.relatedScene.btnVolumen.visible = false;

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
            this.relatedScene.btnVolumen.visible = true;
            if (this.relatedScene.item.respuesta.tres) {
                this.relatedScene.opcionC.visible = true;
            }

            this.relatedScene.video2.stop();
            this.relatedScene.video2.visible = false;

            this.relatedScene.niveles.nextLevel(false);
            if (this.relatedScene.reproducirAudio) {
                this.relatedScene.bg_audio.resume();
            }
        }, 18000);
    }
}