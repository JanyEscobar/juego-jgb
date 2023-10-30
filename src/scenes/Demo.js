import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { doc, updateDoc, getFirestore } from "../../node_modules/firebase/firebase-firestore.js";

class Demo extends Phaser.Scene {
    constructor() {
        super("Demo");
    }

    init(data) {
        // this.time = 0;
        // this.path_dependiente = 'assets/Sprites_gril.png';
        // this.celebracion = 'assets/celebracion_nina.png';
        // this.perdiste = 'assets/girl_sad_body.png';
        // this.happy = 'assets/girl_happy.png';
        // this.sad = 'assets/girl_sad.png';
        // this.personajeDemo = 'assets/sprite_girl_milk1.png';
        // this.comenzar = true;
        // this.nivel = 1;
        // this.id = false;
        // this.personaje = 'assets/Sprites_gril.png';

        this.time = data.time;
        this.path_dependiente = data.path_dependiente;
        this.celebracion = data.celebracion;
        this.perdiste = data.perdiste;
        this.happy = data.happy;
        this.sad = data.sad;
        this.personajeDemo = data.personajeDemo;
        this.comenzar = data.comenzar;
        this.nivel = data.nivel ?? 1;
        this.id = data.id ?? false;
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
        this.load.image('skip', 'assets/skip.png');
        this.load.image('textoDemo1', 'assets/textoDemo1.png');
        this.load.image('textoDemo2', 'assets/textoDemo2.png');
        this.load.image('textoDemo3', 'assets/textoDemo3.png');
        this.load.image('textoDemo4', 'assets/textoDemo4.png');
        this.load.image('textoDemo5', 'assets/textoDemo5.png');
        this.load.image('opcionA', 'assets/a.png');
        this.load.image('opcionB', 'assets/b.png');
        this.load.spritesheet('pillDemo', 'assets/objetos.png', { frameWidth: 75.4, frameHeight: 196 });
        this.load.spritesheet('dependientespriteDemo', this.path_dependiente, { frameWidth: 128, frameHeight: 129 });
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
        this.mostrarSoloTarritos = true;
        this.mostrarSoloVida = false;
        this.mostrarSoloTrampas = false;
        this.maximoElementos = 1;
        this.mostrarMensajeTarrito = true;
        this.mostrarMensajeVida = true;
        this.mostrarMensajeTrampa = true;

        this.background = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.2, 'backgroundDemo');
        this.background.setScale(window.innerWidth * 0.0023, window.innerHeight * 0.002);
        this.mundo = this.add.text(this.cameras.main.width * 0.25, 10, "Mundo \nVitaminas y Minerales", { color: '#FFF', fontSize: '15px', fontFamily: 'sans-serif', fontStyle: 'normal', fontWeight: 'blod', lineSpacing: 1.1 }).setDepth(1);
        this.mensaje = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'mensaje');
        this.mensaje.setScale(window.innerWidth * 0.0015, window.innerHeight * 0.001);
        this.mensaje.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.tarritos = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.64, 'tarritos');
        this.tarritos.setScale(window.innerWidth * 0.0015, window.innerHeight * 0.001);
        this.tarritos.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.personajeDemo = this.add.image(this.cameras.main.width / 2.1, window.innerHeight * 0.66, 'personajeDemo');
        this.personajeDemo.setScale(window.innerWidth * 0.0015, window.innerHeight * 0.001);
        this.personajeDemo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        
        this.playerDemo = this.physics.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.66, 'dependientespriteDemo').setInteractive().setDepth(2);
        this.playerDemo.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0011);
        this.playerDemo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.playerDemo.setCollideWorldBounds(true);
        this.playerDemo.visible = false;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.balloonDemo = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.12, 'balloonDemo').setDepth(1).setAlpha(0.95);
        this.balloonDemo.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.balloonDemo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.balloonDemo.visible = false;

        this.groundDemo = this.physics.add.image(window.innerWidth * 0.5, window.innerHeight * 0.9, 'groundDemo').setDepth(1);
        this.groundDemo.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.groundDemo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.groundDemo.setCollideWorldBounds(true);
        this.groundDemo.setImmovable(true);
        this.groundDemo.visible = false;
        this.btnDemo = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.8, 'btnDemo').setInteractive();
        this.btnDemo.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.btnDemo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.btnGo = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.9, 'btnGo').setInteractive();
        this.btnGo.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.btnGo.visible = false;
        this.btnGo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);

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
            this.scene.pause();
            if (dragX > gameObject.x) {
                this.playerDemo.anims.play('right', true);
                this.mostrarDerecha = true;
                this.mostrarIzquierda = false;
                if (!this.moverDerecha) {
                    this.moverDerecha = true;
                }
            }
            if (dragX < gameObject.x) {
                // if (this.permitirMoverse) {
                //     this.playerDemo.setFrame(3);
                //     setTimeout(() => {
                //         this.permitirMoverse = false;
                //         this.playerDemo.setFrame(3);
                //     }, 100);
                //     setTimeout(() => {
                //         this.playerDemo.setFrame(2);
                //     }, 400);
                //     setTimeout(() => {
                //         this.playerDemo.setFrame(1);
                //         this.permitirMoverse = true;
                //     }, 600);
                // }
                this.playerDemo.anims.play('left', true);
                this.mostrarDerecha = false;
                this.mostrarIzquierda = true;
                if (!this.moverIzquierda) {
                    this.moverIzquierda = true;
                }
            }
            gameObject.x = dragX;

            if (this.textoDemo2) {
                this.textoDemo2.destroy();
            }
            if (this.textoDemo1) {
                this.textoDemo1.destroy();
                this.opcionA.destroy();
                this.opcionB.destroy();
                this.respuesta1.destroy();
                this.respuesta2.destroy();
            }
            this.scene.resume('Demo');
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
            this.playerDemo.visible = true;
            this.mensaje.visible = false;
            this.btnDemo.visible = false;
            this.personajeDemo.visible = false;
            this.tarritos.visible = false;
            this.mundo.x = 15;
            this.mensajeDemo = this.add.text(window.innerWidth * 0.2, window.innerHeight * 0.8, "Aquí te preguntaremos algo \nsobre Tarrito Rojo", { fontWeight: 'blod', fontFamily: 'sans-serif', fontSize: '25px', fontStyle: 'normal', color: '#B70E0C', align: "center" }).setDepth(1);
            this.mensajeDemo.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.mensajeDemo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.opcionA = this.physics.add.image(window.innerWidth * 0.2, window.innerHeight * 0.93, 'opcionA').setDepth(1);
            this.opcionA.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.opcionA.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.opcionA.setCollideWorldBounds(true);
            this.opcionA.setImmovable(true);
            this.opcionA.body.allowGravity = false;
            this.opcionB = this.physics.add.image(window.innerWidth * 0.6, window.innerHeight * 0.93, 'opcionB').setDepth(1);
            this.opcionB.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.opcionB.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.opcionB.setCollideWorldBounds(true);
            this.opcionB.setImmovable(true);
            this.opcionB.body.allowGravity = false;

            let tamanoTexto = this.cameras.main.width * 0.07 > 27 ? 27 : this.cameras.main.width * 0.065;
            this.respuesta1 = this.add.text(window.innerWidth * 0.25, window.innerHeight * 0.885, "Esta es una \nRespuesta", { fontFamily: 'sans-serif', fontSize: `${tamanoTexto}px`, color: '#FFF', align: 'center', fontStyle: 'normal', fontWeight: '700', lineSpacing: 1.1, stroke: '#FF0000', strokeThickness: 4 }).setDepth(1);
            this.respuesta1.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.respuesta1.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.respuesta2 = this.add.text(window.innerWidth * 0.65, window.innerHeight * 0.885, "Esta es otra \nRespuesta", { fontFamily: 'sans-serif', fontSize: `${tamanoTexto}px`, color: '#FFF', align: 'center', fontStyle: 'normal', fontWeight: '700', lineSpacing: 1.1, stroke: '#FF0000', strokeThickness: 4 }).setDepth(1);
            this.respuesta2.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.respuesta2.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);

            this.textoDemo1 = this.physics.add.image(this.cameras.main.width / 2, window.innerHeight * 0.58, 'textoDemo1').setDepth(1).setInteractive();
            this.textoDemo1.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.textoDemo1.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.textoDemo1.setCollideWorldBounds(true);
            this.textoDemo1.setImmovable(true);
            this.textoDemo1.body.allowGravity = false;
            this.textoDemo1.on('pointerdown', () => {
                this.textoDemo1.destroy();
                this.opcionA.destroy();
                this.opcionB.destroy();
                this.respuesta1.destroy();
                this.respuesta2.destroy();
                this.mensajeDemo.y = window.innerHeight * 0.85;
                this.mensajeDemo.setText('Desliza el personaje a los \nlados y atrapa el Tarrito.').setFontSize(this.cameras.main.width * 0.07 > 27 ? 27 : this.cameras.main.width * 0.08);
                this.textoDemo2 = this.physics.add.image((this.playerDemo.x == window.innerWidth - 40 ? this.playerDemo.x - 80 : this.playerDemo.x + 50), this.playerDemo.y - 80, 'textoDemo2').setDepth(1).setInteractive();
                this.textoDemo2.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                this.textoDemo2.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                this.textoDemo2.setCollideWorldBounds(true);
                this.textoDemo2.setImmovable(true);
                this.textoDemo2.body.allowGravity = false;
                this.textoDemo2.on('pointerdown', () => {
                    this.textoDemo2.destroy();
                });
            });
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
                "time": this.time,
                "id": this.id,
                "personaje": this.personaje,
            });
        });

        this.btnSkip = this.add.image(this.cameras.main.width * 0.5, window.innerHeight * 0.9, 'skip').setInteractive();
        this.btnSkip.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.btnSkip.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        
        this.btnSkip.on('pointerdown', () => {
            this.scene.start("Game", {
                "path_dependiente": this.path_dependiente,
                "celebracion": this.celebracion,
                "perdiste": this.perdiste,
                "happy": this.happy,
                "sad": this.sad,
                "time": this.time,
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
        if (this.id) {
            this.actualizarDemo(db, this.id);
        }
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
                if (this.answerDemo == 3 || this.answerDemo == 1 || this.answerDemo == 2) {
                    this.mostrarSoloVida = true;
                    this.mostrarSoloTarritos = false;
                    this.maximoElementos = 1;
                    this.pillsDemo.clear(true, true);
                } else if (this.answerDemo == 7) {
                    this.mostrarSoloVida = false;
                    this.mostrarSoloTrampas = true;
                    this.maximoElementos = 1;
                    this.pillsDemo.clear(true, true);
                } else if (this.answerDemo == 4 || this.answerDemo == 5) {
                    this.mostrarSoloTrampas = false;
                    this.pillsDemo.clear(true, true);
                }
                if (!this.mostrarSoloTarritos && !this.mostrarSoloVida && !this.mostrarSoloTrampas) {
                    this.groundDemo.destroy();
                    this.mensajeDemo.destroy();
                    this.btnSkip.destroy();
                    this.background.setTexture('background');
                    this.groundDemo = this.physics.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'cuadro_mensaje').setDepth(1);
                    this.groundDemo.setScale(window.innerWidth * 0.0015, window.innerHeight * 0.001);
                    this.mensajeDemo = this.add.text(window.innerWidth * 0.22, this.cameras.main.height / 2.2, "¡Muy bien! estas\n listo para empezar!", { fontFamily: 'sans-serif', fontSize: '30px', fontStyle: 'normal', color: '#B70E0C', align: "center" }).setDepth(1);
                    this.mensajeDemo.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                    this.groundDemo.body.allowGravity = false;
                    this.playerDemo.visible = false;
                    this.btnGo.visible = true;
                    this.pillsDemo.clear(true, true);
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
            if (item.y > window.innerHeight * 0.92) {
                item.destroy();
            }
        });

        if (this.playerDemo.visible && this.moverIzquierda && this.moverDerecha && !this.dejarDeMostrar) {
            this.comenzarTarritos = true;
            this.dejarDeMostrar = true;
        }

        if (this.mostrarSoloTarritos && this.mostrarMensajeTarrito) {
            this.pillsDemo.getChildren().forEach(item => {
                if (item.y > window.innerHeight / 3) {
                    this.scene.pause();
                    let pos = [window.innerWidth / 7, window.innerWidth / 2, window.innerWidth - 40];
                    let posicionX = item.x;
                    if (item.x == window.innerWidth / 7) {
                        posicionX =  item.x + 80;
                    } 
                    if (item.x == window.innerWidth - 40) {
                        posicionX = item.x - 80;
                    }
                    let posicionY = item.y - 50;
                    this.textoDemo3 = this.physics.add.image(posicionX, posicionY, 'textoDemo3').setDepth(1).setInteractive();
                    this.textoDemo3.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                    this.textoDemo3.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    setTimeout(() => {
                        this.textoDemo3.destroy();
                        this.scene.resume('Demo');
                        this.mostrarMensajeTarrito = false;
                        this.maximoElementos = 3;
                    }, 10000);
                }
            });
        }
        if (this.mostrarSoloVida && this.mostrarMensajeVida) {
            this.pillsDemo.getChildren().forEach(item => {
                if (item.y > window.innerHeight / 3) {
                    this.scene.pause();
                    let pos = [window.innerWidth / 7, window.innerWidth / 2, window.innerWidth - 40];
                    let posicionX = item.x;
                    if (item.x == window.innerWidth / 7) {
                        posicionX =  item.x + 80;
                    } 
                    if (item.x == window.innerWidth - 40) {
                        posicionX = item.x - 80;
                    }
                    let posicionY = item.y - 50;
                    this.textoDemo4 = this.physics.add.image(posicionX, posicionY, 'textoDemo4').setDepth(1).setInteractive();
                    this.textoDemo4.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                    this.textoDemo4.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    setTimeout(() => {
                        this.textoDemo4.destroy();
                        this.scene.resume('Demo');
                        this.mostrarMensajeVida = false;
                        this.maximoElementos = 3;
                    }, 10000);
                }
            });
        }
        if (this.mostrarSoloTrampas && this.mostrarMensajeTrampa) {
            this.pillsDemo.getChildren().forEach(item => {
                if (item.y > window.innerHeight / 3) {
                    this.scene.pause();
                    let pos = [window.innerWidth / 7, window.innerWidth / 2, window.innerWidth - 40];
                    let posicionX = item.x;
                    if (item.x == window.innerWidth / 7) {
                        posicionX =  item.x + 80;
                    } 
                    if (item.x == window.innerWidth - 40) {
                        posicionX = item.x - 80;
                    }
                    let posicionY = item.y - 50;
                    this.textoDemo5 = this.physics.add.image(posicionX, posicionY, 'textoDemo5').setDepth(1).setInteractive();
                    this.textoDemo5.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                    this.textoDemo5.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    setTimeout(() => {
                        this.textoDemo5.destroy();
                        this.scene.resume('Demo');
                        this.mostrarMensajeTrampa = false;
                        this.maximoElementos = 3;
                    }, 10000);
                }
            });
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
        let posiciones = [window.innerWidth / 7, window.innerWidth / 2, window.innerWidth - 40];
        let posicionesActuales = [];
        if (this.pillsDemo.countActive() < this.maximoElementos) {
            this.pillsDemo.getChildren().forEach(item => {
                posicionesActuales.push(item.x);
            });
            let p = posiciones[this.getRandomIntDemo(0, 2)];
            while (posicionesActuales.includes(p)) {
                p = posiciones[this.getRandomIntDemo(0, 2)];
            }
            var pill = this.pillsDemo.get(p, -68).setCircle(2, 0, 120).setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            let fin = 7;
            let inicio = 1;
            if (this.mostrarSoloTarritos) {
                fin = 3;
            }
            if (this.mostrarSoloTrampas) {
                fin = 5;
                inicio = 4;
            }
            pill.answer = this.getRandomIntDemo(inicio, fin);
            if (this.mostrarSoloVida) {
                pill.answer = 7;
            }
            // console.log(pill.answer);
            // pill.setFrame(7);
            pill.setFrame(pill.answer - 1);
            pill.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
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
            // this.textoAccion.setText('Vamos a la izquierda');
        }
    }
}

export default Demo;