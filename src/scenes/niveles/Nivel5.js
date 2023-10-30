import { Phase } from './Phase.js';

export class Nivel5 extends Phase {

    preload() {
        
    }
    
    create() {
        if (this.relatedScene.reproducirAudio) {
            this.relatedScene.bg_audio.resume();
        }
        this.background = this.relatedScene.background.setTexture('background4', 0);
        this.relatedScene.nombreBackground = 'background4';
        this.relatedScene.balloon.setTexture('balloon4', 0);
        this.relatedScene.player.visible = false;
        this.relatedScene.player.x = this.relatedScene.cameras.main.width / 2;
        this.relatedScene.ground.setTexture('ground', 0);
        this.relatedScene.palabraVida.setColor('#FFFFFF');
        this.relatedScene.pregunta.setColor('#B70E0C');
        this.relatedScene.respuesta1.setColor('#FFFFFF').setShadow(2, 2, '#B70E0C', 2).setStroke('#FF0000', 4);
        this.relatedScene.respuesta2.setColor('#FFFFFF').setShadow(2, 2, '#B70E0C', 2).setStroke('#FF0000', 4);
        this.relatedScene.respuesta3.setColor('#FFFFFF').setShadow(2, 2, '#B70E0C', 2).setStroke('#FF0000', 4);
        this.relatedScene.opcionA.setTexture('opcionA', 0);
        this.relatedScene.opcionB.setTexture('opcionB', 0);
        this.relatedScene.opcionC.setTexture('opcionC', 0);
        this.pills = this.relatedScene.physics.add.group({
            defaultKey: 'pill2'
        });
        this.relatedScene.nombreMundo.setText('Mundo Energía').setColor('#FFFFFF');
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