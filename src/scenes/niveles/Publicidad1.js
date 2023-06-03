export class Publicidad1 {
    constructor(scene) {
        this.relatedScene = scene;
    }

    create() {
        this.personaje = this.relatedScene.add.image(200, 540, 'personajeLeche');
        this.tarrito = this.relatedScene.add.image(470, 250, 'tarrito').setDepth(1);
        this.granola = this.relatedScene.add.image(380, 350, 'granola');
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
            this.personaje.visible = false;
            this.tarrito.visible = false;
            this.granola.visible = false;
            this.relatedScene.niveles.nextLevel(false);
        }, 2000);
    }
}