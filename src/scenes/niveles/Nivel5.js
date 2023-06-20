import { Phase } from './Phase.js';

export class Nivel5 extends Phase {
    create() {
        this.relatedScene.bg_audio.resume();
        this.background = this.relatedScene.background.setTexture('background5', 0);
        this.relatedScene.ground.setTexture('ground2', 0);
        this.relatedScene.balloon.setTexture('balloon2', 0);
        this.relatedScene.pregunta.setColor('#FFFFFF');
        this.relatedScene.respuesta1.setColor('#FFFFFF');
        this.relatedScene.respuesta2.setColor('#FFFFFF');
        this.relatedScene.respuesta3.setColor('#FFFFFF');
        this.relatedScene.nombreBackground = 'background5';
        this.relatedScene.player.visible = false;
        this.relatedScene.player.x = 270;
        this.pills = this.relatedScene.physics.add.group({
            defaultKey: 'pill3'
        });
        this.relatedScene.nombreMundo.setText('Mundo Vainilla').setColor('#B70E0C');
        this.configureColisions();

        this.relatedScene.cuenta = this.relatedScene.physics.add.sprite(280, 350, 'cuenta').setDepth(1);
        this.relatedScene.cuenta.body.allowGravity = false;
        this.relatedScene.anims.create({
            key: 'tiempo',
            frames: this.relatedScene.anims.generateFrameNumbers('cuenta', { start: 0, end: 3 }),
            duration: 4000
        });

        this.relatedScene.cuenta.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function() {
            this.player.visible = true;
            this.cuenta.visible = false;
        }, this.relatedScene);

        this.relatedScene.cuenta.anims.play('tiempo');
    }
}