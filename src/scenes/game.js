import config from '../preguntas_procilus_prolardii.js'
import { Niveles } from "./Niveles.js";
import { Vidas } from "./componentes/Vidas.js";

class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init(data) {
        this.cantidadVidas = data.cantidadVidas ?? 3;
        this.respawn = data.time;
        this.path_dependiente = data.path_dependiente;
        this.celebracion = data.celebracion;
        this.perdiste = data.perdiste;
        this.happy = data.happy;
        this.sad = data.sad;
        this.comenzar = data.comenzar;
        this.niveles = new Niveles(this);
        this.vidas = new Vidas(this, this.cantidadVidas);
    }

    preload() {
        this.load.image('personajeLeche', 'assets/jgb/sprite_boy_milk.png');
        this.load.image('tarrito', 'assets/jgb/tarrito.png');
        this.load.image('granola', 'assets/jgb/granola.png');

        this.load.image('home', 'assets/jgb/home.png');
        this.load.image('background', 'assets/jgb/nivel_1.png');
        this.load.image('background2', 'assets/jgb/nivel_2.png');
        this.load.image('background3', 'assets/jgb/nivel_3.png');
        this.load.image('background4', 'assets/jgb/nivel_4.png');
        this.load.image('background5', 'assets/jgb/nivel_5.png');
        this.load.image('ground', 'assets/jgb/group_1.png');
        this.load.image('balloon', 'assets/jgb/balloon.png');
        this.load.image('balloon_ok', 'assets/balloon_ok.png');
        this.load.image('balloon_fail', 'assets/balloon_fail.png');
        this.load.image('vidas', 'assets/jgb/vitaminas.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('cuadroMensajes', 'assets/jgb/cuadro_mensajes.png');
        this.load.image('siguienteNivel', 'assets/jgb/sigiente_nivel_texto.png');
        this.load.image('tablero', 'assets/jgb/tablero.png');
        this.load.image('happy', this.happy);
        this.load.image('ganaste', 'assets/jgb/ganaste.png');

        this.load.spritesheet('btnSiguiente', 'assets/jgb/spriteSiguiente.png', { frameWidth: 364, frameHeight: 94 });
        this.load.spritesheet('cuenta', 'assets/jgb/cuenta.png', { frameWidth: 170, frameHeight: 155 });
        this.load.spritesheet('dependientesprite', this.path_dependiente, { frameWidth: 140, frameHeight: 130 });
        this.load.spritesheet('pill', 'assets/jgb/objetos.png', { frameWidth: 72, frameHeight: 148 });

        this.load.audio('bg_audio', ['assets/latin1.mp3']);
        this.load.audio('swallow', ['assets/swallow.mp3']);
    }

    create() {
        this.mode = 1;
        this.right = 0;
        this.score = 0;
        this.pillCollition = false;
        this.sideCollition = 1;
        this.question_id = 1;
        this.answer;
        this.correctAnswer = 0;
        this.balloon_ok = null;
        this.balloon_fail = null;
        this.loSabias = '';

        this.bg_audio = this.sound.add('bg_audio', { loop: true });
        this.bg_audio.play();
        this.swallow = this.sound.add('swallow', { loop: false });

        this.background = this.add.image(270, 380, 'background');
        this.nombreBackground = 'background';
        this.iniciarComponentes();
    }

    update(time, delta) {
        if (this.pillCollition) {
            if (this.sideCollition) {
                this.player.anims.play('eatFromRight');
            } else {
                this.player.anims.play('eatFromLeft');
            }
            this.niveles.getPill();
            // this.scene.pause();
            setTimeout(() => {
                if (this.answer == this.correctAnswer) {
                    this.player.anims.play('correct');
                    this.balloon_ok = this.add.image(this.player.x, this.player.y - 90, 'balloon_ok');
                } else {
                    this.player.anims.play('fail');
                    this.balloon_fail = this.add.image(this.player.x, this.player.y - 90, 'balloon_fail');
                    let sinVidas = this.vidas.accionVidas();
                    if (sinVidas) {
                        this.results(false);
                    }
                }
            }, 1000);
            setTimeout(() => {
                if (this.mode == 1) {
                    if (this.answer == this.correctAnswer) {
                        this.right++;
                        this.next_question(1);
                    } else {
                        this.next_question(0);
                    }
                }
            }, 1000);

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
            frameRate: 4,
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
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'eatFromRight',
            frames: [{ key: 'dependientesprite', frame: 8 }],
            duration: 1000
        });

        this.anims.create({
            key: 'eatFromLeft',
            frames: [{ key: 'dependientesprite', frame: 0 }],
            duration: 1000
        });

        this.anims.create({
            key: 'fail',
            frames: [{ key: 'dependientesprite', frame: 9 }],
            duration: 1000
        });

        this.anims.create({
            key: 'correct',
            frames: [{ key: 'dependientesprite', frame: 10 }],
            duration: 1000
        });
    }

    next_question(valor) {
        // this.scene.resume('Game');
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
                this.tablero = this.add.image(270, 370, 'tablero');
                this.ganaste = this.add.image(270, 315, 'ganaste');
                this.siguienteNivel = this.add.image(270, 400, 'siguienteNivel');
                this.happy = this.add.image(270, 545, 'happy');
                if (this.balloon_ok) { this.balloon_ok.destroy(); }
                this.btnSiguiente = this.add.sprite(270, 730, 'btnSiguiente').setInteractive();
                this.btnSiguiente.on('pointerover', () => {
                    this.btnSiguiente.setFrame(1);
                }).on('pointerout', () => {
                    this.btnSiguiente.setFrame(0);
                }).on('pointerdown', () => {
                    this.player.visible = true;
                    this.ground.visible = true;
                    this.balloon.visible = true;
                    this.pregunta.visible = true;
                    this.respuesta1.visible = true;
                    this.respuesta2.visible = true;
                    this.respuesta3.visible = true;
                    this.btnSiguiente.visible = false;
                    this.tablero.visible = false;
                    this.ganaste.visible = false;
                    this.siguienteNivel.visible = false;
                    this.happy.visible = false;
                    this.load_questions();
                    this.bg_audio.resume();
                    this.background.setTexture(this.nombreBackground, 0);
                    this.niveles.nextLevel();
                    this.question_id++;
                });
            } else {
                this.results();
            }
        } else {
            if (this.balloon_fail) { this.balloon_fail.destroy(); }
            this.player.visible = false;
            this.ground.visible = false;
            this.balloon.visible = false;
            this.pregunta.visible = false;
            this.respuesta1.visible = false;
            this.respuesta2.visible = false;
            this.respuesta3.visible = false;
            this.cuadroMensajes = this.add.image(270, 380, 'cuadroMensajes');
            this.contenido = this.add.text(20, 250, this.loSabias, { font: "bold 18px Verdana", color: "#00000", align: "center", fixedWidth: 490 }).setDepth(1);
            this.btnSiguiente = this.add.sprite(270, 600, 'btnSiguiente').setInteractive();
            this.btnSiguiente.on('pointerover', () => {
                this.btnSiguiente.setFrame(1);
            }).on('pointerout', () => {
                this.btnSiguiente.setFrame(0);
            }).on('pointerdown', () => {
                this.player.visible = true;
                this.ground.visible = true;
                this.balloon.visible = true;
                this.pregunta.visible = true;
                this.respuesta1.visible = true;
                this.respuesta2.visible = true;
                this.respuesta3.visible = true;
                this.cuadroMensajes.visible = false;
                this.contenido.visible = false;
                this.btnSiguiente.visible = false;
                this.load_questions();
                this.bg_audio.resume();
                this.background.setTexture(this.nombreBackground, 0);
                this.niveles.nextLevel();
                this.question_id++;
            });
        }
    }

    results(tieneVida = true) {
        if (this.mode) {
            this.score = this.right * 20;
            let imagen = this.celebracion;
            if (this.score < 60) {
                imagen = this.sad;
            }
            // this.scene.resume('Game');
            this.scene.start('Resultado', {
                'respuesta': tieneVida,
                'score': this.score,
                "right": this.right,
                "imagen": imagen
            });
        }
    }

    load_questions() {
        let pregunta_index = this.getRandomInt(0, config.data.length - 1);
        let item = config.data.splice(pregunta_index, 1)[0];
        this.pregunta.setText(item.pregunta);
        this.respuesta1.setText(item.respuesta.uno);
        this.respuesta2.setText(item.respuesta.dos);
        this.respuesta3.setText(item.respuesta.tres);
        this.correctAnswer = item.correcta;
        this.loSabias = item.loSabias;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    iniciarComponentes() {
        if (this.contenido) {
            this.contenido.destroy();
        }
        this.cursors = this.input.keyboard.createCursorKeys();
        this.balloon = this.add.image(270, 85, 'balloon').setDepth(1).setAlpha(0.95);
        
        this.player = this.physics.add.sprite(270, 400, 'dependientesprite');
        this.player.setCollideWorldBounds(true);
        
        this.nombreMundo = this.add.text(15, 15, "Mundo Tradicional", { fontFamily: 'Arial Black', fontSize: '22px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
        this.ground = this.physics.add.image(270, 730, 'ground').setDepth(1);
        this.ground.setCollideWorldBounds(true);
        this.ground.setImmovable(true);
        
        this.pregunta = this.add.text(30, 600, "", { font: "bold 18px Verdana", color: "#FFFFFF", align: "center", fixedWidth: 490 }).setDepth(1);
        this.respuesta1 = this.add.text(110, 680, "", { font: "bold 18px Verdana", color: "#FFFFFF" }).setDepth(1);
        this.respuesta2 = this.add.text(280, 680, "", { font: "bold 18px Verdana", color: "#FFFFFF" }).setDepth(1);
        this.respuesta3 = this.add.text(445, 680, "", { font: "bold 18px Verdana", color: "#FFFFFF" }).setDepth(1);
        
        this.load_questions();
        
        this.animatePlayer();
        
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
}

export default Game;