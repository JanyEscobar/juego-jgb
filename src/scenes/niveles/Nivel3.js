import { Phase } from './Phase.js';

export class Nivel3 extends Phase {

    preload() {
        // this.relatedScene.load.video('videoPublicidad3', ['assets/publicidad3.mp4']);
    }

    create() {
        if (this.relatedScene.reproducirAudio) {
            this.relatedScene.bg_audio.resume();
        }
        this.background = this.relatedScene.background.setTexture('background5', 0);
        this.relatedScene.ground.setTexture('ground2', 0);
        this.relatedScene.balloon.setTexture('balloon2', 0);
        this.relatedScene.palabraVida.setColor('#B70E0C');
        this.relatedScene.pregunta.setColor('#FFFFFF');
        this.relatedScene.respuesta1.setColor('#FFFFFF').setShadow(1, 1, '#000000', 1).setStroke(null, 0).setFontSize(18);
        this.relatedScene.respuesta2.setColor('#FFFFFF').setShadow(1, 1, '#000000', 1).setStroke(null, 0).setFontSize(18);
        this.relatedScene.respuesta3.setColor('#FFFFFF').setShadow(1, 1, '#000000', 1).setStroke(null, 0).setFontSize(18);
        this.relatedScene.respuesta1.y = window.innerHeight * 0.89;
        this.relatedScene.respuesta2.y = window.innerHeight * 0.89;
        this.relatedScene.respuesta3.y = window.innerHeight * 0.89;
        this.relatedScene.nombreBackground = 'background5';
        this.relatedScene.player.visible = false;
        this.relatedScene.player.x = this.relatedScene.cameras.main.width / 2;
        this.pills = this.relatedScene.physics.add.group({
            defaultKey: 'pill3'
        });
        this.relatedScene.nombreMundo.setText('Mundo Bienestar').setColor('#B70E0C');
        this.configureColisions();
        this.relatedScene.opcionA.setTexture('opcionA1', 0);
        this.relatedScene.opcionB.setTexture('opcionB1', 0);
        this.relatedScene.opcionC.setTexture('opcionC1', 0);

        this.relatedScene.cuenta = this.relatedScene.physics.add.sprite(this.relatedScene.cameras.main.width / 2, this.relatedScene.cameras.main.height / 2, 'cuenta').setDepth(1);
        this.relatedScene.cuenta.setScale(window.innerWidth * 0.0015, window.innerHeight * 0.001);
        this.relatedScene.cuenta.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.relatedScene.cuenta.body.allowGravity = false;
        this.relatedScene.anims.create({
            key: 'tiempo',
            frames: this.relatedScene.anims.generateFrameNumbers('cuenta', { start: 0, end: 3 }),
            duration: 7000
        });

        this.relatedScene.cuenta.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function() {
            this.player.visible = true;
            this.cuenta.visible = false;
        }, this.relatedScene);

        this.relatedScene.cuenta.anims.play('tiempo');
    }
}