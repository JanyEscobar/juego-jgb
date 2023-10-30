import { Phase } from './Phase.js';

export class Nivel1 extends Phase {

    preload() {
        // this.relatedScene.load.video('videoPublicidad1', ['assets/publicidad1.mp4']);
        // console.log('jany 1');
    }

    create() {
        this.relatedScene.player.visible = false;
        this.pills = this.relatedScene.physics.add.group({
            defaultKey: 'pill'
        });
        this.relatedScene.nombreMundo.setText('Mundo Vitaminas');
        this.configureColisions();

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