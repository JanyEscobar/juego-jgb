import { Phase } from './Phase.js';

export class Nivel2 extends Phase {

    preload() {
        // this.relatedScene.load.video('videoPublicidad2', ['assets/publicidad2.mp4']);
    }

    create() {
        if (this.relatedScene.reproducirAudio) {
            this.relatedScene.bg_audio.resume();
        }
        this.background = this.relatedScene.background.setTexture('background2', 0);
        this.relatedScene.nombreBackground = 'background2';
        this.relatedScene.balloon.setTexture('balloon1', 0);
        this.relatedScene.player.visible = false;
        this.relatedScene.player.x = this.relatedScene.cameras.main.width / 2;
        this.pills = this.relatedScene.physics.add.group({
            defaultKey: 'pill1'
        });
        this.relatedScene.nombreMundo.setText('Mundo Minerales');
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