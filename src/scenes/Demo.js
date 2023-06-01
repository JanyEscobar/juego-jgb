class Demo extends Phaser.Scene {
    constructor() {
        super("Demo");
    }

    init(data) {
        this.time = data.time;
        this.path_dependiente = data.path_dependiente;
        this.celebracion = data.celebracion;
        this.perdiste = data.perdiste;
        this.happy = data.happy;
        this.sad = data.sad;
        this.personajeDemo = data.personajeDemo;
        this.comenzar = data.comenzar;
    }

    preload() {
        this.load.image('background', 'assets/jgb/nivel_1.png');
        this.load.image('mensaje', 'assets/jgb/mensaje_demo.png');
        this.load.image('groundDemo', 'assets/jgb/group.png');
        this.load.image('balloonDemo', 'assets/jgb/balloon.png');
        this.load.image('personajeDemo', this.personajeDemo);
        this.load.spritesheet('pillDemo', 'assets/jgb/objetos.png', { frameWidth: 72, frameHeight: 148 });
        this.load.spritesheet('dependientespriteDemo', this.path_dependiente, { frameWidth: 140, frameHeight: 130 }); // prueba
        // this.load.spritesheet('dependientespriteDemo', this.path_dependiente, { frameWidth: 96.8, frameHeight: 125 });
        this.load.spritesheet('btnDemo', 'assets/jgb/boton_demo.png', { frameWidth: 364, frameHeight: 94 });
        this.load.spritesheet('btnGo', 'assets/jgb/boton_go.png', { frameWidth: 350, frameHeight: 120 });
    }

    create() {
        this.pillCollitionDemo = false;
        this.sideCollitionDemo = 1;
        this.gorightDemo = false;
        this.goleftDemo = false;
        this.answerDemo;

        this.background = this.add.image(270, 380, 'background');
        this.mundo = this.add.text(15, 15, "Mundo Tradicional", { fontFamily: 'Rammetto One', fontSize: '22px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
        this.mensaje = this.add.image(270, 400, 'mensaje');
        this.personajeDemo = this.add.image(475, 485, 'personajeDemo');
        
        this.playerDemo = this.physics.add.sprite(270, 563, 'dependientespriteDemo');
        this.playerDemo.setCollideWorldBounds(true);
        this.playerDemo.visible = false;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.balloonDemo = this.add.image(270, 85, 'balloonDemo').setDepth(1).setAlpha(0.95);
        this.balloonDemo.visible = false;

        this.groundDemo = this.physics.add.image(270, 730, 'groundDemo').setDepth(1);
        this.groundDemo.setCollideWorldBounds(true);
        this.groundDemo.setImmovable(true);
        this.groundDemo.visible = false;
        this.btnDemo = this.add.sprite(270, 640, 'btnDemo').setInteractive();
        this.btnGo = this.add.sprite(270, 710, 'btnGo').setInteractive();
        this.btnGo.visible = false;

        this.animatePlayerDemo();

        this.pillsDemo = this.physics.add.group({
            defaultKey: 'pillDemo'
        });

        this.physics.add.collider(
            this.playerDemo,
            this.pillsDemo,
            this.eatPillDemo,
            null,
            this
        );

        this.physics.add.collider(
            this.playerDemo,
            this.groundDemo,
            () => true,
            null,
            this
        );

        this.btnDemo.on('pointerover', () => {
            this.btnDemo.setFrame(1);
        }).on('pointerout', () => {
            this.btnDemo.setFrame(0);
        }).on('pointerdown', () => {
            this.playerDemo.visible = true;
            this.groundDemo.visible = true;
            this.balloonDemo.visible = true;
            this.mensaje.visible = false;
            this.btnDemo.visible = false;
            this.personajeDemo.visible = false;
            this.mensajeDemo = this.add.text(50, 670, "Desliza el personaje a los lados y atrapa el tarrito\n Si estas en un ordenador, utiliza el teclado", { fontFamily: 'Rammetto One', fontSize: '22px', fontStyle: 'normal', color: '#FFFFFF', align: "center" }).setDepth(1);
        });

        this.btnGo.on('pointerover', () => {
            this.btnGo.setFrame(1);
        }).on('pointerout', () => {
            this.btnGo.setFrame(0);
        }).on('pointerdown', () => {
            this.groundDemo.destroy();
            this.scene.start("Firstscene", {
                "path_dependiente": this.path_dependiente,
                "celebracion": this.celebracion,
                "perdiste": this.perdiste,
                "happy": this.happy,
                "sad": this.sad,
                "comenzar": this.comenzar,
                "time": this.time
            });
        });
    }

    update(time, delta) {
        if (this.pillCollitionDemo) {
            if (this.sideCollitionDemo) {
                this.playerDemo.anims.play('eatFromRight');
            } else {
                this.playerDemo.anims.play('eatFromLeft');
            }
            this.groundDemo.destroy();
            this.mensajeDemo.destroy();
            this.groundDemo = this.physics.add.image(270, 400, 'groundDemo').setDepth(1);
            this.mensajeDemo = this.add.text(50, 360, "Muy bien! estas listo para empezar!", { fontFamily: 'Rammetto One', fontSize: '22px', fontStyle: 'normal', color: '#FFFFFF', align: "center" }).setDepth(1);
            this.groundDemo.body.allowGravity = false;
            this.playerDemo.visible = false;
            this.btnGo.visible = true;
            this.pillsDemo.clear(true, true);

        } else if (this.cursors.left.isDown || this.goleftDemo) {
            this.playerDemo.setVelocityX(-220);
            this.playerDemo.setVelocityY(0);
            this.playerDemo.anims.play('left', true);
        } else if (this.cursors.right.isDown || this.gorightDemo) {
            this.playerDemo.setVelocityX(220);
            this.playerDemo.setVelocityY(0);
            this.playerDemo.anims.play('right', true);
        } else {
            this.playerDemo.setVelocityX(0);
            this.playerDemo.anims.play('turn')
        }

        if (time > this.time && this.playerDemo.visible == true) {
            this.pillsFallingDemo();
            this.time += 2000;
        }

        this.pillCollitionDemo = false;
    }

    animatePlayerDemo() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dependientespriteDemo', { start: 3, end: 1 }), // prueba
            // frames: this.anims.generateFrameNumbers('dependientespriteDemo', { start: 5, end: 3 }),
            frameRate: 4,
            repeat: -1,
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dependientespriteDemo', frame: 4 }], // prueba
            // frames: [{ key: 'dependientespriteDemo', frame: 10 }],
            frameRate: 4
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dependientespriteDemo', { start: 5, end: 7 }), // prueba
            // frames: this.anims.generateFrameNumbers('dependientespriteDemo', { start: 15, end: 17 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'eatFromRight',
            frames: [{ key: 'dependientespriteDemo', frame: 8 }],
            // frames: [{ key: 'dependientespriteDemo', frame: 10 }],
            frameRate: 4,
            duration: 500
        });

        this.anims.create({
            key: 'eatFromLeft',
            frames: [{ key: 'dependientespriteDemo', frame: 0 }],
            frameRate: 4,
            duration: 500
        });
    }

    pillsFallingDemo() {
        var pill = this.pillsDemo.get(this.getRandomIntDemo(50, 490), -68).setCircle(2, 0, 120);
        pill.answer = this.getRandomIntDemo(1, 3);
        pill.setFrame(pill.answer - 1);
    }

    eatPillDemo(player, pill) {
        this.answerDemo = pill.answer;
        this.pillCollitionDemo = true;
        this.sideCollitionDemo = player.x > pill.x ? 1 : 0;
        pill.destroy();
        this.gorightDemo = false;
        this.goleftDemo = false;
    }

    getRandomIntDemo(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
}

export default Demo;