import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { doc, updateDoc, getFirestore, getDoc } from "../../node_modules/firebase/firebase-firestore.js";
import config from '../preguntas_nivel_1.js'
import { Niveles } from "./Niveles.js";
import { Vidas } from "./componentes/Vidas.js";

class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init(data) {
        this.id = data.id ?? false;
        this.path_dependiente = data.path_dependiente;
        this.respawn = data.time;
        this.celebracion = data.celebracion;
        this.perdiste = data.perdiste;
        this.happy = data.happy;
        this.sad = data.sad;
        this.personaje = data.personaje;
    }

    preload() {
        this.load.audio('bg_audio', ['assets/latin1.mp3']);
        this.load.audio('swallow', ['assets/swallow.mp3']);

        // this.load.video('videoPublicidad1', ['assets/publicidad1.mp4']);
        // this.load.video('videoPublicidad2', ['assets/publicidad2.mp4']);
        // this.load.video('videoPublicidad3', ['assets/publicidad3.mp4']);
        // this.load.video('videoPublicidad4', ['assets/publicidad4.mp4']);
        
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
        this.load.image('balloon1', 'assets/balloon1.png');
        this.load.image('balloon2', 'assets/balloon2.png');
        this.load.image('balloon3', 'assets/balloon3.png');
        this.load.image('balloon4', 'assets/balloon4.png');
        this.load.image('vidas', 'assets/vitaminas.png');
        this.load.image('cuadroMensajes', 'assets/mensaje_incorrecto.png');
        this.load.image('siguienteNivel', 'assets/sigiente_nivel_texto.png');
        this.load.image('tablero', 'assets/tablero.png');
        this.load.image('happy', this.happy);
        this.load.image('sad', this.sad);
        this.load.image('ganaste', 'assets/ganaste.png');
        this.load.image('estrellas', 'assets/estrellas.png');
        this.load.image('estrellas1', 'assets/estrellas1.png');
        
        this.load.spritesheet('btnSiguiente', 'assets/btnSiguiente.png', { frameWidth: 340, frameHeight: 160 });
        this.load.spritesheet('cuenta', 'assets/cuenta.png', { frameWidth: 175, frameHeight: 132 });
        this.load.spritesheet('volumen', 'assets/volumen.png', { frameWidth: 120, frameHeight: 120 });
        this.load.spritesheet('dependientesprite', this.path_dependiente, { frameWidth: 128, frameHeight: 129 });
        this.load.spritesheet('pill', 'assets/objetos.png', { frameWidth: 75.4, frameHeight: 196 });
        this.load.spritesheet('pill1', 'assets/objetos1.png', { frameWidth: 78.25, frameHeight: 185 });
        this.load.spritesheet('pill2', 'assets/objetos2.png', { frameWidth: 79.5, frameHeight: 185 });
        this.load.spritesheet('pill3', 'assets/objetos3.png', { frameWidth: 80, frameHeight: 185 });
        this.load.spritesheet('pill4', 'assets/objetos4.png', { frameWidth: 78.5, frameHeight: 185 });
    }

    async create() {
        this.pregunta_index = 0;
        this.puntos = 0;
        this.scene.pause();
        this.nivel = 1;
        if (this.id) {
            this.nivel = await this.nivelActual();
        }
        this.scene.resume('Game');
        this.niveles = new Niveles(this, this.nivel);
        this.vidas = new Vidas(this, 3);
        this.mode = 1;
        this.right = 0;
        this.score = 0;
        this.pillCollition = false;
        this.sideCollition = 1;
        this.question_id = this.nivel;
        this.answer;
        this.correctAnswer = 0;
        this.loSabias = '';
        this.proteccion = false;
        this.permitirMoverse = true;
        this.reproducirAudio = true;

        this.bg_audio = this.sound.add('bg_audio', { loop: true });
        this.bg_audio.play();
        this.swallow = this.sound.add('swallow', { loop: false });

        this.background = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.2, 'background');
        this.background.setScale(window.innerWidth * 0.0023, window.innerHeight * 0.002);
        this.nombreBackground = 'background';
        
        if (this.contenido) {
            this.contenido.destroy();
        }
        this.cursors = this.input.keyboard.createCursorKeys();
        this.balloon = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.12, 'balloon').setDepth(1).setAlpha(0.95);
        this.balloon.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.balloon.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        
        this.player = this.physics.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.66, 'dependientesprite').setInteractive().setDepth(1);
        this.player.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0011);
        this.player.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.player.setCollideWorldBounds(true);

        this.btnVolumen = this.add.sprite(this.cameras.main.width * 0.9, window.innerHeight * 0.2, 'volumen').setDepth(1).setInteractive();
        this.btnVolumen.setFrame(1);
        this.btnVolumen.on('pointerdown', () => {
            if (this.bg_audio.isPlaying) {
                this.btnVolumen.setFrame(0);
                this.bg_audio.pause();
                this.reproducirAudio = false;
            } else {
                this.btnVolumen.setFrame(1);
                this.bg_audio.resume();
                this.reproducirAudio = true;
            }
        });
        this.btnVolumen.setScale(window.innerWidth * 0.0012, window.innerHeight * 0.0008);
        this.btnVolumen.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);

        this.nombreMundo = this.add.text(15, 15, "Mundo Tradicional", { fontFamily: 'sans-serif', fontSize: '22px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
        this.nombreMundo.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.nombreMundo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.palabraVida = this.add.text(window.innerWidth * 0.55, 10, "Vidas:", { fontFamily: 'sans-serif', fontSize: '22px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
        this.palabraVida.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.palabraVida.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.ground = this.physics.add.image(window.innerWidth * 0.5, window.innerHeight * 0.9, 'ground').setDepth(1);
        this.ground.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.ground.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.ground.setCollideWorldBounds(true);
        this.ground.setImmovable(true);
        this.opcionA = this.physics.add.image(window.innerWidth * 0.2, window.innerHeight * 0.93, 'opcionA').setDepth(1);
        this.opcionA.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.opcionA.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.opcionA.setCollideWorldBounds(true);
        this.opcionA.setImmovable(true);
        this.opcionA.body.allowGravity = false;
        this.opcionB = this.physics.add.image(window.innerWidth * 0.26, window.innerHeight * 0.93, 'opcionB').setDepth(1);
        this.opcionB.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.opcionB.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.opcionB.setCollideWorldBounds(true);
        this.opcionB.setImmovable(true);
        this.opcionB.body.allowGravity = false;
        this.opcionC = this.physics.add.image(window.innerWidth * 0.25, window.innerHeight * 0.93, 'opcionC').setDepth(1);
        this.opcionC.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.opcionC.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.opcionC.setCollideWorldBounds(true);
        this.opcionC.setImmovable(true);
        this.opcionC.body.allowGravity = false;
        
        let tamanoTexto = this.cameras.main.width * 0.07 > 27 ? 27 : this.cameras.main.width * 0.065;
        this.pregunta = this.add.text(30, window.innerHeight * 0.8, "", { fontFamily: 'sans-serif', fontSize: `${tamanoTexto}px`, fontStyle: 'normal', color: "#B70E0C", align: "center", fixedWidth: 490 }).setDepth(1);
        this.pregunta.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.pregunta.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.respuesta1 = this.add.text(90, window.innerHeight * 0.91, "", { fontFamily: 'sans-serif', fontSize: '28px', color: '#FFF', align: 'center', fontStyle: 'normal', fontWeight: '700', lineSpacing: 1.1, stroke: '#FF0000', strokeThickness: 4 }).setDepth(1);
        this.respuesta1.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.respuesta1.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.respuesta2 = this.add.text(260, window.innerHeight * 0.91, "", { fontFamily: 'sans-serif', fontSize: '28px', color: '#FFF', align: 'center', fontStyle: 'normal', fontWeight: '700', lineSpacing: 1.1, stroke: '#FF0000', strokeThickness: 4 }).setDepth(1);
        this.respuesta2.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.respuesta2.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.respuesta3 = this.add.text(420, window.innerHeight * 0.91, "", { fontFamily: 'sans-serif', fontSize: '28px', color: '#FFF', align: 'center', fontStyle: 'normal', fontWeight: '700', lineSpacing: 1.1, stroke: '#FF0000', strokeThickness: 4 }).setDepth(1);
        this.respuesta3.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.respuesta3.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
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
            this.scene.pause();
            if (dragX > gameObject.x) {
                this.player.anims.play('right', true);
                this.mostrarDerecha = true;
                this.mostrarIzquierda = false;
                if (this.estrellas) {
                    this.estrellas.x = dragX + 30;
                }
                if (this.estrellas1) {
                    this.estrellas1.x = dragX - 30;
                }
            }
            if (dragX < gameObject.x) {
                this.player.anims.play('left', true);
                this.mostrarDerecha = false;
                this.mostrarIzquierda = true;
                if (this.estrellas) {
                    this.estrellas.x = dragX + 30;
                }
                if (this.estrellas1) {
                    this.estrellas1.x = dragX - 30;
                }
            }
            gameObject.x = dragX;
            this.scene.resume('Game');
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
                    // Accion de estrella de granolas
                    this.scene.resume('Game');
                } else if (this.answer == 7) {
                    this.proteccion = true;
                    if (!this.estrellas && !this.estrellas1) {
                        this.estrellas = this.add.image(this.player.x + 30, this.player.y, 'estrellas').setInteractive();
                        this.estrellas.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                        this.estrellas.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                        this.estrellas1 = this.add.image(this.player.x - 30, this.player.y, 'estrellas1').setInteractive();
                        this.estrellas1.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                        this.estrellas1.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    }
                    this.scene.resume('Game');
                } else if (this.answer == 8) {
                    this.vidas.agregarVida();
                    this.vidas.agregarNombreVida(true);
                    this.scene.resume('Game');
                } else if (this.answer == 5 && !this.proteccion) {
                    this.player.anims.play('fail');
                    let sinVidas = this.vidas.accionVidas();
                    if (sinVidas) {
                        setTimeout(() => {
                            this.results(false);
                        }, 900);
                    } else {
                        this.vidas.agregarNombreVida(true);
                    }
                    this.scene.resume('Game');
                } else {
                    if (!this.proteccion) {
                        let muerteTotal = this.answer == 4;
                        if (muerteTotal) {
                            setTimeout(() => {
                                this.player.setFrame(11);
                            }, 200);
                            setTimeout(() => {
                                this.player.setFrame(12);
                            }, 300);
                            setTimeout(() => {
                                this.player.setFrame(13);
                            }, 400);
                            setTimeout(() => {
                                this.player.setFrame(14);
                            }, 500);
                            setTimeout(() => {
                                this.player.setFrame(15);
                            }, 600);
                        } else {
                            this.player.anims.play('fail');
                        }
                        let sinVidas = this.vidas.accionVidas(muerteTotal);
                        if (sinVidas) {
                            setTimeout(() => {
                                this.results(false);
                            }, 900);
                        } else {
                            // this.vidas.eliminarNombreVida();
                            this.vidas.agregarNombreVida(true);
                        }
                    } else {
                        this.scene.resume('Game');
                    }
                }
            }, 300);
            setTimeout(() => {
                if (this.mode == 1 && (this.answer == 1 || this.answer == 2 || this.answer == 3)) {
                    if (this.answer == this.correctAnswer) {
                        this.right++;
                        this.puntos+= 20;
                        this.actualizarPuntos();
                        this.next_question(1);
                    } else if ((this.answer == 1 || this.answer == 2 || this.answer == 3) && !this.proteccion) {
                        this.next_question(0);
                    }
                    this.pregunta_index+= 1;
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
        } else if (this.player && this.isDragging) {
        } else if (this.player) {
            this.player.setVelocityX(0);
            this.player.anims.play('turn')
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
        this.bg_audio.pause();
        this.niveles.getPill();
        this.actualizarNivel();
        if (this.estrellas) {
            this.estrellas.destroy();
        }
        if (this.estrellas1) {
            this.estrellas1.destroy();
        }
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
                this.nombreMundo.visible = false;
                this.palabraVida.visible = false;
                this.btnVolumen.visible = false;
                if (this.opcionA1 && this.opcionB1 && this.opcionC1) {
                    this.opcionC1.setVisible(false);
                    this.opcionA1.setVisible(false);
                    this.opcionB1.setVisible(false);
                }
                this.tablero = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.45, 'tablero');
                this.tablero.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                this.tablero.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                this.ganaste = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.37, 'ganaste');
                this.ganaste.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                this.ganaste.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                this.siguienteNivel = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.45, 'siguienteNivel');
                this.siguienteNivel.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                this.siguienteNivel.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                this.happy = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.65, 'happy');
                this.happy.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                this.happy.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                this.btnSiguiente = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.95, 'btnSiguiente').setInteractive();
                this.btnSiguiente.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
                this.btnSiguiente.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
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
                    this.nombreMundo.visible = true;
                    this.palabraVida.visible = true;
                    this.btnVolumen.visible = true;
                    this.btnSiguiente.visible = false;
                    this.tablero.visible = false;
                    this.ganaste.visible = false;
                    this.siguienteNivel.visible = false;
                    this.happy.visible = false;
                    if (this.question_id < 5) {
                        this.load_questions();
                        this.background.setTexture(this.nombreBackground, 0);
                        this.niveles.nextLevel();
                    } else {
                        this.results();
                    }
                    
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
            this.nombreMundo.visible = false;
            this.palabraVida.visible = false;
            this.btnVolumen.visible = false;
            if (this.opcionA1 && this.opcionB1 && this.opcionC1) {
                this.opcionC1.setVisible(false);
                this.opcionA1.setVisible(false);
                this.opcionB1.setVisible(false);
            }
            this.cuadroMensajes = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'cuadroMensajes');
            this.cuadroMensajes.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.cuadroMensajes.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.contenido = this.add.text(this.cameras.main.width * 0.05, window.innerHeight * 0.55, this.loSabias, { font: "bold 18px Verdana", color: "#00000", align: "center", fixedWidth: 490 }).setDepth(1);
            this.contenido.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.contenido.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.imagenSad = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.25, 'sad').setScale(0.7, 0.7);
            this.imagenSad.setScale(window.innerWidth * 0.0014, window.innerHeight * 0.001);
            this.imagenSad.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.btnSiguiente = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.8, 'btnSiguiente').setInteractive();
            this.btnSiguiente.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.btnSiguiente.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
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
                this.nombreMundo.visible = true;
                this.palabraVida.visible = true;
                this.btnVolumen.visible = true;
                this.cuadroMensajes.visible = false;
                this.contenido.visible = false;
                this.btnSiguiente.visible = false;
                this.imagenSad.visible = false;
                if (this.question_id < 5) {
                    this.load_questions();
                    this.background.setTexture(this.nombreBackground, 0);
                    this.niveles.nextLevel();
                } else {
                    this.results();
                }
                this.question_id++;
            });
        }
    }

    results(tieneVida = true) {
        this.bg_audio.pause();
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
                "id": this.id,
                "puntos": this.puntos,
            });
        }
    }

    async load_questions() {
        this.opcionA.setVisible(true);
        this.opcionB.setVisible(true);
        this.opcionC.setVisible(true);
        this.opcionA.x = window.innerWidth * 0.12;
        this.opcionB.x = window.innerWidth * 0.42;
        this.opcionC.x = window.innerWidth * 0.7;
        this.respuesta1.x = window.innerWidth * 0.17;
        this.respuesta2.x = window.innerWidth * 0.47;
        this.respuesta3.x = window.innerWidth * 0.75;
        this.respuesta1.y = window.innerHeight * 0.91;
        this.respuesta2.y = window.innerHeight * 0.91;
        this.respuesta3.y = window.innerHeight * 0.91;
        this.respuesta1.setText('');
        this.respuesta2.setText('');
        this.respuesta3.setText('');
        this.scene.pause();
        if (this.id) {
            this.pregunta_index = await this.nivelActual() - 1;
        }
        this.scene.resume('Game');
        let item = config.data[this.pregunta_index];
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
            this.opcionA.x = window.innerWidth * 0.2;
            this.opcionB.x = window.innerWidth * 0.6;
            this.respuesta1.x = window.innerWidth * 0.25;
            this.respuesta2.x = window.innerWidth * 0.65;
            if (this.opcionA1 && this.opcionB1 && this.opcionC1) {
                this.opcionC1.setVisible(false);
                this.opcionA1.x = window.innerWidth * 0.2;
                this.opcionB1.x = window.innerWidth * 0.6;
            }
        }
        if (item.respuesta.uno.length > 9) {
            this.respuesta1.setFontSize(24);
        }
        if (item.respuesta.dos.length > 9) {
            this.respuesta2.setFontSize(24);
        }
        this.correctAnswer = item.correcta;
        console.log(item.pregunta, item.correcta);
        this.loSabias = item.loSabias;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async actualizarPuntos() {
        if (this.id) {
            let db = this.configData();
            let docRef = doc(db, "usuarios", this.id);
            let docSnap = await getDoc(docRef);
            let washingtonRef = doc(db, "usuarios", this.id);
            await updateDoc(washingtonRef, {
                puntos: docSnap.data().puntos + 20
            });
        } else {

        }
    }

    async actualizarNivel() {
        if (this.id) {
            let db = this.configData();
            let docRef = doc(db, "usuarios", this.id);
            let docSnap = await getDoc(docRef);
            let washingtonRef = doc(db, "usuarios", this.id);
            let siguiente = docSnap.data().nivel == 5 ? 1 : docSnap.data().nivel + 1;
            await updateDoc(washingtonRef, {
                nivel: siguiente
            });
        }
    }

    async nivelActual() {
        let db = this.configData();
        let docRef = doc(db, "usuarios", this.id);
        let docSnap = await getDoc(docRef);
        // this.cargando.anims.stop();
        // this.cargando.visible = false;
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