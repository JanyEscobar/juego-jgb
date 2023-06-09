import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { doc, updateDoc, getFirestore } from "../../node_modules/firebase/firebase-firestore.js";

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
        this.nivel = data.nivel ?? 1;
        this.id = data.id;
        this.personaje = data.personaje;
    }

    preload() {
        this.load.image('backgroundDemo', 'assets/jgb/Demo.png');
        this.load.image('background', 'assets/jgb/nivel_1.png');
        this.load.image('mensaje', 'assets/jgb/mensaje_demo.png');
        this.load.image('groundDemo', 'assets/jgb/group.png');
        this.load.image('balloonDemo', 'assets/jgb/balloon.png');
        this.load.image('tarritos', 'assets/jgb/tarritos.png');
        this.load.image('flechaderecha', 'assets/jgb/flechaderecha.png');
        this.load.image('flechaizquierda', 'assets/jgb/flechaizquierda.png');
        this.load.image('cuadro_mensaje', 'assets/jgb/cuadro_mensaje.png');
        this.load.image('personajeDemo', this.personajeDemo);
        this.load.spritesheet('pillDemo', 'assets/jgb/objetos.png', { frameWidth: 84, frameHeight: 185 });
        this.load.spritesheet('dependientespriteDemo', this.path_dependiente, { frameWidth: 140, frameHeight: 125 });
        this.load.spritesheet('cuenta', 'assets/jgb/cuenta.png', { frameWidth: 175, frameHeight: 132 });
        this.load.spritesheet('btnDemo', 'assets/jgb/btnDemo.png', { frameWidth: 364, frameHeight: 94 });
        this.load.spritesheet('btnGo', 'assets/jgb/btnGo.png', { frameWidth: 400, frameHeight: 160 });
    }

    create() {
        this.pillCollitionDemo = false;
        this.sideCollitionDemo = 1;
        this.answerDemo;
        this.mostrarCuenta = true;
        this.num = 0;
        this.moverIzquierda = false;
        this.moverDerecha = false;
        this.comenzarTarritos = false;

        this.background = this.add.image(270, 380, 'backgroundDemo');
        this.mundo = this.add.text(180, 15, "Mundo Tradicional", { fontFamily: 'Arial Black', fontSize: '22px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
        this.cuenta = this.physics.add.sprite(270, 350, 'cuenta').setDepth(1);
        this.cuenta.body.allowGravity = false;
        this.anims.create({
            key: 'tiempo',
            frames: this.anims.generateFrameNumbers('cuenta', { start: 0, end: 3 }),
            duration: 4000
        });

        this.cuenta.visible = false;
        this.mensaje = this.add.image(270, 350, 'mensaje');
        this.tarritos = this.add.image(280, 500, 'tarritos');
        this.personajeDemo = this.add.image(240, 500, 'personajeDemo');
        
        this.playerDemo = this.physics.add.sprite(250, 563, 'dependientespriteDemo').setInteractive();
        this.playerDemo.setCollideWorldBounds(true);
        this.playerDemo.visible = false;

        this.cuenta.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function() {
            this.playerDemo.visible = true;
            this.cuenta.visible = false;
            this.flechaDerecha = this.add.image(500, 500, 'flechaderecha');
        }, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.balloonDemo = this.add.image(270, 85, 'balloonDemo').setDepth(1).setAlpha(0.95);
        this.balloonDemo.visible = false;

        this.groundDemo = this.physics.add.image(270, 730, 'groundDemo').setDepth(1);
        this.groundDemo.setCollideWorldBounds(true);
        this.groundDemo.setImmovable(true);
        this.groundDemo.visible = false;
        this.btnDemo = this.add.sprite(270, 640, 'btnDemo').setInteractive();
        this.btnGo = this.add.sprite(270, 690, 'btnGo').setInteractive();
        this.btnGo.visible = false;

        this.animatePlayerDemo();

        // Habilita el arrastre del sprite
        this.input.setDraggable(this.playerDemo);

        // Evento para iniciar el arrastre
        this.input.on('dragstart', function (pointer, gameObject) {
            if (pointer.isDown) {
                gameObject.setTint(0xff0000);
                this.draggedObject = gameObject;
                this.isDragging = true;
              }
        }, this);

        // Evento para mover el sprite mientras se arrastra
        this.input.on('drag', function (pointer, gameObject, dragX) {
            if (dragX > gameObject.x) {
                this.mostrarDerecha = true;
                this.mostrarIzquierda = false;
                if (!this.moverDerecha) {
                    this.moverDerecha = true;
                    this.textoAccion.setText('Vamos a la izquierda');
                }
            }
            if (dragX < gameObject.x) {
                this.mostrarDerecha = false;
                this.mostrarIzquierda = true;
                if (!this.moverIzquierda) {
                    this.moverIzquierda = true;
                }
            }
            gameObject.x = dragX;
        }, this);

        // Evento para finalizar el arrastre
        this.input.on('dragend', function (pointer, gameObject) {
            gameObject.clearTint();
            this.isDragging = false;
        }, this);

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
            // this.btnDemo.setFrame(1);
        }).on('pointerout', () => {
            // this.btnDemo.setFrame(0);
        }).on('pointerdown', () => {
            this.groundDemo.visible = true;
            this.balloonDemo.visible = true;
            this.mensaje.visible = false;
            this.btnDemo.visible = false;
            this.personajeDemo.visible = false;
            this.tarritos.visible = false;
            this.mundo.x = 15;
            this.mensajeDemo = this.add.text(50, 630, "Desliza el personaje a los lados y\n atrapa el tarrito Si estas en un\n ordenador, utiliza el teclado", { fontFamily: 'Arial Black', fontSize: '22px', fontStyle: 'normal', color: '#B70E0C', align: "center" }).setDepth(1);
            this.textoAccion = this.add.text(140, 710, 'Vamos a la derecha', { fontFamily: 'Arial Black', fontSize: '22px', fontStyle: 'normal', color: '#B70E0C', align: "center" }).setDepth(1);
            this.cuenta.visible = true;
            this.cuenta.anims.play('tiempo');
        });

        this.btnGo.on('pointerover', () => {
            // this.btnGo.setFrame(1);
        }).on('pointerout', () => {
            // this.btnGo.setFrame(0);
        }).on('pointerdown', () => {
            this.groundDemo.destroy();
            this.scene.start("Game", {
                "path_dependiente": this.path_dependiente,
                "celebracion": this.celebracion,
                "perdiste": this.perdiste,
                "happy": this.happy,
                "sad": this.sad,
                "comenzar": this.comenzar,
                "time": this.time,
                "nivel": this.nivel,
                "id": this.id,
                "personaje": this.personaje,
            });
        });
        let firebaseConfig = {
            apiKey: "AIzaSyBRtGvmHjHUHksWz_3LD4Xk998GCJBWZwU",
            authDomain: "juego-jgb-54a43.firebaseapp.com",
            projectId: "juego-jgb-54a43",
            storageBucket: "juego-jgb-54a43.appspot.com",
            messagingSenderId: "809198562223",
            appId: "1:809198562223:web:6958a36d10fc3f9a551d5a",
            measurementId: "G-W01GKVNYE0"
        };
        let app = initializeApp(firebaseConfig);
        let db = getFirestore(app);
        this.actualizarDemo(db, this.id);
    }

    update(time, delta) {
        if (this.pillCollitionDemo) {
            if (this.sideCollitionDemo) {
                this.playerDemo.anims.play('eatFromRight');
            } else {
                this.playerDemo.anims.play('eatFromLeft');
            }

            if (this.answerDemo == 3) {
                this.groundDemo.destroy();
                this.mensajeDemo.destroy();
                this.textoAccion.destroy();
                this.background.setTexture('background');
                this.groundDemo = this.physics.add.image(270, 400, 'cuadro_mensaje').setDepth(1);
                this.mensajeDemo = this.add.text(110, 360, "¡Muy bien! estas\n listo para empezar!", { fontFamily: 'Arial Black', fontSize: '30px', fontStyle: 'normal', color: '#B70E0C', align: "center" }).setDepth(1);
                this.groundDemo.body.allowGravity = false;
                this.playerDemo.visible = false;
                this.btnGo.visible = true;
                this.pillsDemo.clear(true, true);
            } else {
                this.textoAccion.setText('Debes atrapar el tarrito con la letra C');
            }

        } else if (this.cursors.left.isDown && this.moverDerecha) {
            this.playerDemo.setVelocityX(-220);
            this.playerDemo.setVelocityY(0);
            this.playerDemo.anims.play('left', true);
            if (!this.moverIzquierda) {
                this.moverIzquierda = true;
                this.flechaizquierda.destroy();
            }
        } else if (this.cursors.right.isDown) {
            this.playerDemo.setVelocityX(220);
            this.playerDemo.setVelocityY(0);
            this.playerDemo.anims.play('right', true);
            if (!this.moverDerecha) {
                this.moverDerecha = true;
                this.flechaDerecha.destroy();
                this.textoAccion.setText('Vamos a la izquierda');
                this.flechaizquierda = this.add.image(40, 500, 'flechaizquierda');
            }
        } else {
            this.playerDemo.setVelocityX(0);
            this.playerDemo.anims.play('turn')
        }

        // Verificar si se está arrastrando el sprite
        if (this.playerDemo && this.isDragging) {
            if (this.mostrarIzquierda) {
                this.playerDemo.anims.play('left', true);
                this.flechaizquierda.destroy();
            }
            if (this.mostrarDerecha) {
                this.playerDemo.anims.play('right', true);
                this.flechaDerecha.destroy();
                this.flechaizquierda = this.add.image(40, 500, 'flechaizquierda');
            }
        }

        if (time > this.time && this.playerDemo.visible && this.moverIzquierda && this.moverDerecha && this.comenzarTarritos) {
            this.pillsFallingDemo();
            this.time += 2000;
        }

        this.pillsDemo.getChildren().forEach(item => {
            if (item.y > 700) {
                item.destroy();
            }
        });

        if (this.playerDemo.visible && this.moverIzquierda && this.moverDerecha) {
            this.textoAccion.y = 650;
            this.textoAccion.x = 100;
            this.mensajeDemo.destroy();
            this.flechaizquierda.destroy();
            this.textoAccion.setText('Muy buen!\nAtrapa el tarrito con la letra C');
            this.comenzarTarritos = true;
        }

        this.pillCollitionDemo = false;
    }

    animatePlayerDemo() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dependientespriteDemo', { start: 3, end: 1 }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dependientespriteDemo', frame: 4 }],
            frameRate: 4
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dependientespriteDemo', { start: 5, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'eatFromRight',
            frames: [{ key: 'dependientespriteDemo', frame: 8 }],
            frameRate: 4,
            duration: 500
        });

        this.anims.create({
            key: 'eatFromLeft',
            frames: [{ key: 'dependientespriteDemo', frame: 0 }],
            frameRate: 4,
            duration: 500
        });

        this.anims.create({
            key: 'fail',
            frames: [{ key: 'dependientespriteDemo', frame: 9 }],
            frameRate: 4,
            duration: 500
        });

        this.anims.create({
            key: 'correct',
            frames: [{ key: 'dependientespriteDemo', frame: 10 }],
            frameRate: 4,
            duration: 500
        });
    }

    pillsFallingDemo() {
        let posiciones = [50, 245, 490];
        let posicionesActuales = [];
        if (this.pillsDemo.countActive() < 3) {
            this.pillsDemo.getChildren().forEach(item => {
                posicionesActuales.push(item.x);
            });
            let p = posiciones[this.getRandomIntDemo(0, 2)];
            while (posicionesActuales.includes(p)) {
                p = posiciones[this.getRandomIntDemo(0, 2)];
            }
            var pill = this.pillsDemo.get(p, -68).setCircle(2, 0, 120);
            pill.answer = this.getRandomIntDemo(1, 5);
            pill.setFrame(pill.answer - 1);
        }
    }

    eatPillDemo(player, pill) {
        this.answerDemo = pill.answer;
        this.pillCollitionDemo = true;
        this.sideCollitionDemo = player.x > pill.x ? 1 : 0;
        pill.destroy();
    }

    getRandomIntDemo(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async actualizarDemo(db, id) {
        const washingtonRef = doc(db, "usuarios", id);
        await updateDoc(washingtonRef, {
            demo: true
        });
    }

    accionMoverDerecha() {
        this.playerDemo.anims.play('right', true);
        if (!this.moverDerecha) {
            this.moverDerecha = true;
            this.textoAccion.setText('Vamos a la izquierda');
        }
    }
}

export default Demo;