import { Phase } from './Phase.js';

export class Nivel4 extends Phase {
    create() {
        this.relatedScene.bg_audio.resume();
        this.background = this.relatedScene.background.setTexture('background4', 0);
        this.relatedScene.nombreBackground = 'background4';
        this.relatedScene.player.visible = false;
        this.relatedScene.player.x = 270;
        this.pills = this.relatedScene.physics.add.group({
            defaultKey: 'pill2'
        });
        this.relatedScene.nombreMundo.setText('Mundo Energía');
        this.configureColisions();

        this.relatedScene.cuenta = this.relatedScene.physics.add.sprite(280, 350, 'cuenta').setDepth(1);
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