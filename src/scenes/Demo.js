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
        this.load.image('backgroundDemo', 'assets/Demo.png');
        this.load.image('background', 'assets/nivel_1.png');
        this.load.image('mensaje', 'assets/mensaje_demo.png');
        this.load.image('groundDemo', 'assets/group.png');
        this.load.image('balloonDemo', 'assets/balloon.png');
        this.load.image('tarritos', 'assets/tarritos.png');
        this.load.image('cuadro_mensaje', 'assets/cuadro_mensaje.png');
        this.load.image('personajeDemo', this.personajeDemo);
        this.load.spritesheet('pillDemo', 'assets/objetos.png', { frameWidth: 75.3, frameHeight: 196 });
        this.load.spritesheet('dependientespriteDemo', this.path_dependiente, { frameWidth: 128, frameHeight: 129 });
        this.load.spritesheet('cuenta', 'assets/cuenta.png', { frameWidth: 175, frameHeight: 132 });
        this.load.spritesheet('btnDemo', 'assets/btnDemo.png', { frameWidth: 364, frameHeight: 94 });
        this.load.spritesheet('btnGo', 'assets/btnGo.png', { frameWidth: 400, frameHeight: 160 });
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
        this.dejarDeMostrar = false;
        this.permitirMoverse = true;

        this.background = this.add.image(270, 500, 'backgroundDemo');
        this.background.setScale(1, 1.25);
      //  this.background.setScale(1, this.game.scale.height * 0.0014);
        this.mundo = this.add.text(180, 15, "Demo", { fontFamily: 'Arial Black', fontSize: '220%', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
        this.cuenta = this.physics.add.sprite(270, 350, 'cuenta').setDepth(1);
        this.cuenta.body.allowGravity = false;
        this.anims.create({
            key: 'tiempo',
            frames: this.anims.generateFrameNumbers('cuenta', { start: 0, end: 3 }),
            duration: 7000
        });

        this.cuenta.visible = false;
        this.mensaje = this.add.image(270, 470, 'mensaje');
        this.tarritos = this.add.image(280, 620, 'tarritos');
        this.personajeDemo = this.add.image(240, 620, 'personajeDemo');
        
        this.playerDemo = this.physics.add.sprite(250, 683, 'dependientespriteDemo').setInteractive();
        this.playerDemo.setCollideWorldBounds(true);
        this.playerDemo.visible = false;

        this.cuenta.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function() {
            this.playerDemo.visible = true;
            this.cuenta.visible = false;
        }, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.balloonDemo = this.add.image(270, 85, 'balloonDemo').setDepth(1).setAlpha(0.95);
        this.balloonDemo.visible = false;

        this.groundDemo = this.physics.add.image(270, 880, 'groundDemo').setDepth(1);
        this.groundDemo.setCollideWorldBounds(true);
        this.groundDemo.setImmovable(true);
        this.groundDemo.visible = false;
        this.btnDemo = this.add.sprite(270, 760, 'btnDemo').setInteractive();
        this.btnGo = this.add.sprite(270, 880, 'btnGo').setInteractive();
        this.btnGo.visible = false;

        this.animatePlayerDemo();

        // Habilita el arrastre del sprite
        this.input.setDraggable(this.playerDemo);

        // Evento para iniciar el arrastre
        this.input.on('dragstart', function (pointer, gameObject) {
            if (pointer.isDown) {
                this.draggedObject = gameObject;
                this.isDragging = true;
              }
        }, this);

        // Evento para mover el sprite mientras se arrastra
        this.input.on('drag', function (pointer, gameObject, dragX) {
            if (dragX > gameObject.x) {
                this.scene.pause();
                if (this.permitirMoverse) {
                    this.playerDemo.setFrame(5);
                    setTimeout(() => {
                        this.permitirMoverse = false;
                        this.playerDemo.setFrame(5);
                    }, 100);
                    setTimeout(() => {
                        this.playerDemo.setFrame(6);
                    }, 400);
                    setTimeout(() => {
                        this.playerDemo.setFrame(7);
                        this.permitirMoverse = true;
                    }, 600);
                }
                this.scene.resume('Demo');
                this.mostrarDerecha = true;
                this.mostrarIzquierda = false;
                if (!this.moverDerecha) {
                    this.moverDerecha = true;
                    this.textoAccion.setText('Vamos a la izquierda');
                }
            }
            if (dragX < gameObject.x) {
                this.scene.pause();
                if (this.permitirMoverse) {
                    this.playerDemo.setFrame(3);
                    setTimeout(() => {
                        this.permitirMoverse = false;
                        this.playerDemo.setFrame(3);
                    }, 100);
                    setTimeout(() => {
                        this.playerDemo.setFrame(2);
                    }, 400);
                    setTimeout(() => {
                        this.playerDemo.setFrame(1);
                        this.permitirMoverse = true;
                    }, 600);
                }
                this.scene.resume('Demo');
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
            this.mensajeDemo = this.add.text(window.innerWidth > 700 ? 550 * 0.13 : 640 * 0.17, 820, "Desliza el personaje a los lados y\n atrapa el tarrito.", { fontFamily: 'Arial Black', fontSize: '220%', fontStyle: 'normal', color: '#B70E0C', align: "center" }).setDepth(1);
            this.textoAccion = this.add.text(window.innerWidth > 700 ? 550 * 0.3 : 640 * 0.26, 890, 'Vamos a la derecha', { fontFamily: 'Arial Black', fontSize: '220%', fontStyle: 'normal', color: '#B70E0C', align: "center" }).setDepth(1);
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
            this.scene.pause();
            setTimeout(() => {
                if (this.answerDemo == 3) {
                    this.groundDemo.destroy();
                    this.mensajeDemo.destroy();
                    this.textoAccion.destroy();
                    this.background.setTexture('background');
                    this.groundDemo = this.physics.add.image(270, 450, 'cuadro_mensaje').setDepth(1);
                    this.mensajeDemo = this.add.text(window.innerWidth > 700 ? 550 * 0.18 : 640 * 0.2, 410, "¡Muy bien! estas\n listo para empezar!", { fontFamily: 'Arial Black', fontSize: '30px', fontStyle: 'normal', color: '#B70E0C', align: "center" }).setDepth(1);
                    this.groundDemo.body.allowGravity = false;
                    this.playerDemo.visible = false;
                    this.btnGo.visible = true;
                    this.pillsDemo.clear(true, true);
                } else {
                    this.textoAccion.x = window.innerWidth > 700 ? 550 * 0.25 : 640 * 0.25;
                    this.textoAccion.setText('Debes atrapar el tarrito\ncon la letra C');
                }
                this.scene.resume('Demo');
            }, 1000);

        } else if (this.cursors.left.isDown && this.moverDerecha) {
            this.playerDemo.setVelocityX(-220);
            this.playerDemo.setVelocityY(0);
            this.playerDemo.anims.play('left', true);
            if (!this.moverIzquierda) {
                this.moverIzquierda = true;
            }
        } else if (this.cursors.right.isDown) {
            this.playerDemo.setVelocityX(220);
            this.playerDemo.setVelocityY(0);
            this.playerDemo.anims.play('right', true);
            if (!this.moverDerecha) {
                this.moverDerecha = true;
                this.textoAccion.setText('Vamos a la izquierda');
            }
        } else if (this.playerDemo && this.isDragging) {
        } else {
            this.playerDemo.setVelocityX(0);
            this.playerDemo.anims.play('turn')
        }

        if (time > this.time && this.playerDemo.visible && this.moverIzquierda && this.moverDerecha && this.comenzarTarritos) {
            this.pillsFallingDemo();
            this.time += 2000;
        }

        this.pillsDemo.getChildren().forEach(item => {
            if (item.y > 740) {
                item.destroy();
            }
        });

        if (this.playerDemo.visible && this.moverIzquierda && this.moverDerecha && !this.dejarDeMostrar) {
            this.textoAccion.y = 850;
            this.textoAccion.x = window.innerWidth > 700 ? 550 * 0.18 : 640 * 0.18;
            this.mensajeDemo.destroy();
            this.textoAccion.setText('Muy buen!\nAtrapa el tarrito con la letra C');
            this.comenzarTarritos = true;
            this.dejarDeMostrar = true;
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
            duration: 1100
        });

        this.anims.create({
            key: 'eatFromLeft',
            frames: [{ key: 'dependientespriteDemo', frame: 0 }],
            frameRate: 4,
            duration: 1100
        });

        this.anims.create({
            key: 'fail',
            frames: [{ key: 'dependientespriteDemo', frame: 9 }],
            frameRate: 4,
            duration: 1100
        });

        this.anims.create({
            key: 'correct',
            frames: [{ key: 'dependientespriteDemo', frame: 10 }],
            frameRate: 4,
            duration: 1100
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
            pill.answer = this.getRandomIntDemo(1, 7);
            pill.setFrame(pill.answer - 1);
            // pill.setFrame(6);
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