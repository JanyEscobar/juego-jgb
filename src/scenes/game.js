import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { doc, updateDoc, getFirestore, getDoc } from "../../node_modules/firebase/firebase-firestore.js";
import config from '../preguntas_nivel_1.js'
import { Niveles } from "./Niveles.js";
import { Vidas } from "./componentes/Vidas.js";

class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    async init(data) {
        this.id = data.id;
        this.path_dependiente = data.path_dependiente;
        this.cantidadVidas = data.cantidadVidas ?? 3;
        this.respawn = data.time;
        this.celebracion = data.celebracion;
        this.perdiste = data.perdiste;
        this.happy = data.happy;
        this.sad = data.sad;
        this.comenzar = data.comenzar;
        this.personaje = data.personaje;
        this.scene.pause();
        this.nivel = await this.nivelActual();
        console.log(this.nivel);
        this.scene.resume('Game');
        window.config = config;
    }

    preload() {
        if (this.personaje == 1) {
            this.load.image('personajeLeche', 'assets/sprite_boy_milk.png');
        } else {
            this.load.image('personajeLeche', 'assets/sprite_girl_milk.png');
        }
        this.load.image('tarrito', 'assets/tarrito.png');
        this.load.image('granola', 'assets/granola.png');
        
        this.load.image('home', 'assets/Demo.png');
        this.load.image('background', 'assets/nivel_1.png');
        this.load.image('background2', 'assets/nivel_2.png');
        this.load.image('background3', 'assets/nivel_3.png');
        this.load.image('background4', 'assets/nivel_4.png');
        this.load.image('background5', 'assets/nivel_5.png');
        this.load.image('ground', 'assets/group.png');
        this.load.image('opcionA', 'assets/a.png');
        this.load.image('opcionB', 'assets/b.png');
        this.load.image('opcionC', 'assets/c.png');
        this.load.image('opcionA1', 'assets/a1.png');
        this.load.image('opcionB1', 'assets/b1.png');
        this.load.image('opcionC1', 'assets/c1.png');
        this.load.image('balloon', 'assets/balloon.png');
        this.load.image('ground2', 'assets/group1.png');
        this.load.image('balloon2', 'assets/balloon1.png');
        this.load.image('vidas', 'assets/vitaminas1.png');
        this.load.image('cuadroMensajes', 'assets/mensaje_incorrecto.png');
        this.load.image('siguienteNivel', 'assets/sigiente_nivel_texto.png');
        this.load.image('tablero', 'assets/tablero.png');
        this.load.image('happy', this.happy);
        this.load.image('sad', this.sad);
        this.load.image('ganaste', 'assets/ganaste.png');
        
        this.load.spritesheet('btnSiguiente', 'assets/btnSiguiente.png', { frameWidth: 364, frameHeight: 94 });
        this.load.spritesheet('cuenta', 'assets/cuenta.png', { frameWidth: 175, frameHeight: 132 });
        // this.load.spritesheet('dependientesprite', this.path_dependiente, { frameWidth: 128, frameHeight: 129 });
        this.load.spritesheet('dependientesprite', this.path_dependiente, { frameWidth: 140, frameHeight: 125 });
        this.load.spritesheet('pill', 'assets/objetos.png', { frameWidth: 75.3, frameHeight: 196 });
        this.load.spritesheet('pill1', 'assets/objetos1.png', { frameWidth: 78.2, frameHeight: 185 });
        this.load.spritesheet('pill2', 'assets/objetos2.png', { frameWidth: 79, frameHeight: 185 });
        this.load.spritesheet('pill3', 'assets/objetos3.png', { frameWidth: 80, frameHeight: 185 });
        this.load.spritesheet('pill4', 'assets/objetos4.png', { frameWidth: 78.5, frameHeight: 185 });
        
        this.load.audio('bg_audio', ['assets/latin1.mp3']);
        this.load.audio('swallow', ['assets/swallow.mp3']);
        this.load.audio('audioPublicidad1', ['assets/tarrito_rojo.mp3']);

        this.load.video('videoPublicidad1', ['assets/tarrito_rojo.mp4']);
        this.load.video('videoPublicidad2', ['assets/tarrito_rojo1.mp4']);
        this.load.video('videoPublicidad3', ['assets/tarrito_rojo2.mp4']);
    }

    create() {
        this.niveles = new Niveles(this, this.nivel);
        this.vidas = new Vidas(this, this.cantidadVidas);
        this.mode = 1;
        this.right = 0;
        this.score = 0;
        this.pillCollition = false;
        this.sideCollition = 1;
        this.question_id = 1;
        this.answer;
        this.correctAnswer = 0;
        this.loSabias = '';

        this.bg_audio = this.sound.add('bg_audio', { loop: true });
        this.bg_audio.play();
        this.publicidadAudio = this.sound.add('audioPublicidad1', { loop: false });
        this.swallow = this.sound.add('swallow', { loop: false });

        this.video1 = this.add.video(270, 400, 'videoPublicidad1').setScale(0.8).setDepth(2);
        this.video1.visible = false;
        this.video1.stop();
        this.video2 = this.add.video(270, 400, 'videoPublicidad2').setScale(0.8).setDepth(2);
        this.video2.visible = false;
        this.video2.stop();
        this.video3 = this.add.video(270, 400, 'videoPublicidad3').setScale(0.8).setDepth(2);
        this.video3.visible = false;
        this.video3.stop();

        this.background = this.add.image(270, 380, 'background');
        this.nombreBackground = 'background';
        
        if (this.contenido) {
            this.contenido.destroy();
        }
        this.cursors = this.input.keyboard.createCursorKeys();
        this.balloon = this.add.image(270, 85, 'balloon').setDepth(1).setAlpha(0.95);
        
        this.player = this.physics.add.sprite(270, 400, 'dependientesprite').setInteractive();
        this.player.setCollideWorldBounds(true);
        
        this.nombreMundo = this.add.text(15, 15, "Mundo Tradicional", { fontFamily: 'Arial Black', fontSize: '22px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
        this.ground = this.physics.add.image(270, 730, 'ground').setDepth(1);
        this.ground.setCollideWorldBounds(true);
        this.ground.setImmovable(true);
        this.opcionA = this.physics.add.image(60, 712, 'opcionA').setDepth(1);
        this.opcionA.setCollideWorldBounds(true);
        this.opcionA.setImmovable(true);
        this.opcionA.body.allowGravity = false;
        this.opcionB = this.physics.add.image(230, 712, 'opcionB').setDepth(1);
        this.opcionB.setCollideWorldBounds(true);
        this.opcionB.setImmovable(true);
        this.opcionB.body.allowGravity = false;
        this.opcionC = this.physics.add.image(390, 712, 'opcionC').setDepth(1);
        this.opcionC.setCollideWorldBounds(true);
        this.opcionC.setImmovable(true);
        this.opcionC.body.allowGravity = false;
        
        this.pregunta = this.add.text(30, 620, "", { fontFamily: 'Arial Black', fontSize: '20px', fontStyle: 'normal', color: "#B70E0C", align: "center", fixedWidth: 490 }).setDepth(1);
        this.respuesta1 = this.add.text(90, 700, "", { fontFamily: 'Arial Black', fontSize: '22px', fontStyle: 'normal', color: "#B70E0C" }).setDepth(1);
        this.respuesta2 = this.add.text(260, 700, "", { fontFamily: 'Arial Black', fontSize: '22px', fontStyle: 'normal', color: "#B70E0C" }).setDepth(1);
        this.respuesta3 = this.add.text(420, 700, "", { fontFamily: 'Arial Black', fontSize: '22px', fontStyle: 'normal', color: "#B70E0C" }).setDepth(1);
        
        this.load_questions();
        
        this.animatePlayer();

        // Habilita el arrastre del sprite
        this.input.setDraggable(this.player);

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
                this.mostrarDerecha = true;
                this.mostrarIzquierda = false;
            }
            if (dragX < gameObject.x) {
                this.mostrarDerecha = false;
                this.mostrarIzquierda = true;
            }
            gameObject.x = dragX;
        }, this);

        // Evento para finalizar el arrastre
        this.input.on('dragend', function (pointer, gameObject) {
            this.isDragging = false;
        }, this);
        
        this.niveles.create();
        this.vidas.create();

        this.physics.add.collider(
            this.player,
            this.ground,
            () => true,
            null,
            this
        );
    }

    update(time, delta) {
        if (this.pillCollition) {
            if (this.sideCollition) {
                this.player.anims.play('eatFromRight');
            } else {
                this.player.anims.play('eatFromLeft');
            }
            this.scene.pause();
            setTimeout(() => {
                if (this.answer == this.correctAnswer) {
                    this.player.anims.play('correct');
                } else if (this.answer == 6) {
                    this.scene.resume('Game');
                    // this.vidas.agregarVida();
                } else if (this.answer == 7) {
                    this.scene.resume('Game');
                    // this.vidas.agregarVida();
                } else if (this.answer == 8) {
                    this.scene.resume('Game');
                    this.vidas.agregarVida();
                } else {
                    let muerteTotal = this.answer == 4;
                    if (muerteTotal) {
                        this.player.anims.play('explotar');
                        // setTimeout(() => {
                        //     this.player.setFrame(11);
                        // }, 200);
                        // setTimeout(() => {
                        //     this.player.setFrame(12);
                        // }, 300);
                        // setTimeout(() => {
                        //     this.player.setFrame(13);
                        // }, 400);
                        // setTimeout(() => {
                        //     this.player.setFrame(14);
                        // }, 500);
                        // setTimeout(() => {
                        //     this.player.setFrame(15);
                        // }, 600);
                    } else {
                        this.player.anims.play('fail');
                    }
                    let sinVidas = this.vidas.accionVidas(muerteTotal);
                    if (sinVidas) {
                        setTimeout(() => {
                            this.results(false);
                        }, 900);
                    }
                }
            }, 300);
            setTimeout(() => {
                if (this.mode == 1 && this.answer != 6) {
                    if (this.answer == this.correctAnswer) {
                        this.right++;
                        this.actualizarPuntos();
                        this.next_question(1);
                    } else if (this.answer != 6 && this.answer != 7 && this.answer != 8) {
                        this.next_question(0);
                    }
                }
            }, 1300);

        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-220);
            this.player.setVelocityY(0);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown ) {
            this.player.setVelocityX(220);
            this.player.setVelocityY(0);
            this.player.anims.play('right', true);
        } else if (this.player) {
            this.player.setVelocityX(0);
            this.player.anims.play('turn')
        }

        // Verificar si se está arrastrando el sprite
        if (this.player && this.isDragging) {
            if (this.mostrarIzquierda) {
                this.player.anims.play('left', true);
            }
            if (this.mostrarDerecha) {
                this.player.anims.play('right', true);
            }
        }

        if (time > this.respawn && this.player.visible == true) {
            this.niveles.pillsFalling();
            this.respawn += 2000;
        }

        this.niveles.update();

        this.pillCollition = false;
    }

    animatePlayer() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dependientesprite', { start: 3, end: 1 }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dependientesprite', frame: 4 }],
            frameRate: 4
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dependientesprite', { start: 5, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'eatFromRight',
            frames: [{ key: 'dependientesprite', frame: 8 }],
            frameRate: 4,
            duration: 1100
        });

        this.anims.create({
            key: 'eatFromLeft',
            frames: [{ key: 'dependientesprite', frame: 0 }],
            frameRate: 4,
            duration: 1100
        });

        this.anims.create({
            key: 'fail',
            frames: [{ key: 'dependientesprite', frame: 9 }],
            frameRate: 4,
            duration: 1100
        });

        this.anims.create({
            key: 'correct',
            frames: [{ key: 'dependientesprite', frame: 10 }],
            frameRate: 4,
            duration: 1100
        });

        this.anims.create({
            key: 'explotar',
            frames: this.anims.generateFrameNumbers('dependientesprite', { start: 11, end: 15 }),
            frameRate: 4,
            repeat: -1
        });
    }

    next_question(valor) {
        this.niveles.getPill();
        this.actualizarNivel();
        this.scene.resume('Game');
        if (valor) {
            if (this.question_id < 5) {
                this.background.setTexture('home', 0);
                this.player.visible = false;
                this.ground.visible = false;
                this.balloon.visible = false;
                this.pregunta.visible = false;
                this.respuesta1.visible = false;
                this.respuesta2.visible = false;
                this.respuesta3.visible = false;
                this.opcionA.visible = false;
                this.opcionB.visible = false;
                this.opcionC.visible = false;
                if (this.opcionA1 && this.opcionB1 && this.opcionC1) {
                    this.opcionC1.setVisible(false);
                    this.opcionA1.setVisible(false);
                    this.opcionB1.setVisible(false);
                }
                this.tablero = this.add.image(270, 370, 'tablero');
                this.ganaste = this.add.image(270, 315, 'ganaste');
                this.siguienteNivel = this.add.image(270, 400, 'siguienteNivel');
                this.happy = this.add.image(270, 545, 'happy');
                this.btnSiguiente = this.add.sprite(270, 730, 'btnSiguiente').setInteractive();
                this.btnSiguiente.on('pointerover', () => {
                    // this.btnSiguiente.setFrame(1);
                }).on('pointerout', () => {
                    // this.btnSiguiente.setFrame(0);
                }).on('pointerdown', () => {
                    this.player.visible = true;
                    this.ground.visible = true;
                    this.balloon.visible = true;
                    this.pregunta.visible = true;
                    this.respuesta1.visible = true;
                    this.respuesta2.visible = true;
                    this.respuesta3.visible = true;
                    this.opcionA.visible = true;
                    this.opcionB.visible = true;
                    this.opcionC.visible = true;
                    this.btnSiguiente.visible = false;
                    this.tablero.visible = false;
                    this.ganaste.visible = false;
                    this.siguienteNivel.visible = false;
                    this.happy.visible = false;
                    this.load_questions();
                    this.background.setTexture(this.nombreBackground, 0);
                    this.niveles.nextLevel();
                    this.question_id++;
                });
            } else {
                this.results();
            }
        } else {
            this.player.visible = false;
            this.ground.visible = false;
            this.balloon.visible = false;
            this.pregunta.visible = false;
            this.respuesta1.visible = false;
            this.respuesta2.visible = false;
            this.respuesta3.visible = false;
            this.opcionA.visible = false;
            this.opcionB.visible = false;
            this.opcionC.visible = false;
            if (this.opcionA1 && this.opcionB1 && this.opcionC1) {
                this.opcionC1.setVisible(false);
                this.opcionA1.setVisible(false);
                this.opcionB1.setVisible(false);
            }
            this.cuadroMensajes = this.add.image(270, 380, 'cuadroMensajes');
            this.contenido = this.add.text(20, 400, this.loSabias, { font: "bold 18px Verdana", color: "#00000", align: "center", fixedWidth: 490 }).setDepth(1);
            this.imagenSad = this.add.image(270, 200, 'sad').setScale(0.7, 0.7);
            this.btnSiguiente = this.add.sprite(270, 640, 'btnSiguiente').setInteractive();
            this.btnSiguiente.on('pointerover', () => {
                // this.btnSiguiente.setFrame(1);
            }).on('pointerout', () => {
                // this.btnSiguiente.setFrame(0);
            }).on('pointerdown', () => {
                this.player.visible = true;
                this.ground.visible = true;
                this.balloon.visible = true;
                this.pregunta.visible = true;
                this.respuesta1.visible = true;
                this.respuesta2.visible = true;
                this.respuesta3.visible = true;
                this.opcionA.visible = true;
                this.opcionB.visible = true;
                this.opcionC.visible = true;
                this.cuadroMensajes.visible = false;
                this.contenido.visible = false;
                this.btnSiguiente.visible = false;
                this.imagenSad.visible = false;
                this.load_questions();
                this.background.setTexture(this.nombreBackground, 0);
                this.niveles.nextLevel();
                this.question_id++;
            });
        }
    }

    results(tieneVida = true) {
        this.scene.resume('Game');
        if (this.mode) {
            this.score = this.right * 20;
            let imagen = this.celebracion;
            if (!tieneVida) {
                imagen = this.sad;
            }
            this.scene.start('Resultado', {
                'respuesta': tieneVida,
                'score': this.score,
                "right": this.right,
                "imagen": imagen,
                "id": this.id
            });
        }
    }

    async load_questions() {
        this.opcionA.setVisible(true);
        this.opcionB.setVisible(true);
        this.opcionC.setVisible(true);
        this.opcionA.x = 60;
        this.opcionB.x = 230;
        this.opcionC.x = 390;
        this.respuesta1.x = 90;
        this.respuesta2.x = 260;
        this.respuesta3.x = 420;
        this.respuesta1.setText('');
        this.respuesta2.setText('');
        this.respuesta3.setText('');
        this.scene.pause();
        let pregunta_index = await this.nivelActual() - 1;
        this.scene.resume('Game');
        let item = config.data[pregunta_index];
        this.item = item;
        this.pregunta.setText(item.pregunta);
        this.respuesta1.setText(item.respuesta.uno).setFontSize(22);
        this.respuesta2.setText(item.respuesta.dos).setFontSize(22);
        if (item.respuesta.tres) {
            this.respuesta3.setText(item.respuesta.tres ?? '').setFontSize(22);
            if (item.respuesta.tres.length > 9) {
                this.respuesta3.setFontSize(15);
            }
        } else {
            this.opcionC.setVisible(false);
            this.opcionA.x = 110;
            this.opcionB.x = 320;
            this.respuesta1.x = 140;
            this.respuesta2.x = 350;
            if (this.opcionA1 && this.opcionB1 && this.opcionC1) {
                this.opcionC1.setVisible(false);
                this.opcionA1.x = 110;
                this.opcionB1.x = 320;
            }
        }
        if (item.respuesta.uno.length > 9) {
            this.respuesta1.setFontSize(15);
        }
        if (item.respuesta.dos.length > 9) {
            this.respuesta2.setFontSize(15);
        }
        this.correctAnswer = item.correcta;
        this.loSabias = item.loSabias;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async actualizarPuntos() {
        let db = this.configData();
        let docRef = doc(db, "usuarios", this.id);
        let docSnap = await getDoc(docRef);
        let washingtonRef = doc(db, "usuarios", this.id);
        await updateDoc(washingtonRef, {
            puntos: docSnap.data().puntos + 20
        });
    }

    async actualizarNivel() {
        let db = this.configData();
        let docRef = doc(db, "usuarios", this.id);
        let docSnap = await getDoc(docRef);
        let washingtonRef = doc(db, "usuarios", this.id);
        let siguiente = docSnap.data().nivel == 5 ? 1 : docSnap.data().nivel + 1;
        await updateDoc(washingtonRef, {
            nivel: siguiente
        });
    }

    async nivelActual() {
        let db = this.configData();
        let docRef = doc(db, "usuarios", this.id);
        let docSnap = await getDoc(docRef);
        return docSnap.data().nivel;
    }

    configData() {
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
        return db;
    }
}

export default Game;