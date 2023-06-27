import config from '../preguntas_procilus_prolardii.js'

class Firstscene extends Phaser.Scene {
  constructor() {
    super('Firstscene');
  }

  init(data) {
    this.respawn = data.time;
    this.path_dependiente = data.path_dependiente;
    this.celebracion = data.celebracion,
      this.perdiste = data.perdiste,
      this.happy = data.happy,
      this.sad = data.sad,
      this.comenzar = data.comenzar;
  }

  preload() {
    this.load.image('background', 'assets/nivel_1.png');
    this.load.image('background2', 'assets/nivel_2.png');
    this.load.image('background3', 'assets/nivel_3.png');
    this.load.image('background4', 'assets/nivel_4.png');
    this.load.image('background5', 'assets/nivel_5.png');
    this.load.image('ground', 'assets/group_1.png');
    this.load.image('balloon', 'assets/balloon.png');
    this.load.image('balloon_ok', 'assets/balloon_ok.png');
    this.load.image('balloon_fail', 'assets/balloon_fail.png');
    this.load.image('vidas', 'assets/vitaminas.png');
    this.load.image('cuadroMensajes', 'assets/cuadro_mensajes.png');
    // this.load.image('perdiste', 'assets/perdiste.png');

    this.load.spritesheet('dependientesprite', this.path_dependiente, { frameWidth: 140, frameHeight: 130 }); // prueba
    // this.load.spritesheet('dependientesprite', this.path_dependiente, { frameWidth: 96.8, frameHeight: 125 });
    this.load.spritesheet('pill', 'assets/objetos.png', { frameWidth: 72, frameHeight: 148 });
    this.load.spritesheet('checker', 'assets/checkbox.png', { frameWidth: 29, frameHeight: 25 });
    this.load.image('bullet', 'assets/bullet.png');
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
    this.goright = false;
    this.goleft = false;

    this.bg_audio = this.sound.add('bg_audio', { loop: true });
    this.bg_audio.play();
    this.swallow = this.sound.add('swallow', { loop: false });

    this.background = this.add.image(270, 380, 'background');
    this.backgrounds = ["background", "background2", "background3", "background4", "background5"];
    this.balloon = this.add.image(270, 85, 'balloon').setDepth(1).setAlpha(0.95);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = this.physics.add.sprite(270, 400, 'dependientesprite');
    this.player.setCollideWorldBounds(true);

    this.checker1 = this.add.sprite(520, 140, 'checker');
    this.checker2 = this.add.sprite(520, 170, 'checker');
    this.checker3 = this.add.sprite(520, 200, 'checker');
    this.checker4 = this.add.sprite(520, 230, 'checker');
    this.checker5 = this.add.sprite(520, 260, 'checker');

    this.checkers = [this.checker1, this.checker2, this.checker3, this.checker4, this.checker5];

    this.mundo = this.add.text(15, 15, "Mundo Tradicional", { fontFamily: 'Rammetto One', fontSize: '22px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
    this.ground = this.physics.add.image(270, 730, 'ground').setDepth(1);
    this.ground.setCollideWorldBounds(true);
    this.ground.setImmovable(true);


    this.pills = this.physics.add.group({
      defaultKey: 'pill'
    });

    this.physics.add.collider(
      this.player,
      this.pills,
      this.eatPill,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.ground,
      () => true,
      null,
      this
    );

    this.pregunta = this.add.text(30, 600, "", { font: "bold 18px Verdana", color: "#FFFFFF", align: "center", fixedWidth: 490 }).setDepth(1);
    this.respuesta1 = this.add.text(110, 680, "", { font: "bold 18px Verdana", color: "#FFFFFF" }).setDepth(1);
    this.respuesta2 = this.add.text(280, 680, "", { font: "bold 18px Verdana", color: "#FFFFFF" }).setDepth(1);
    this.respuesta3 = this.add.text(445, 680, "", { font: "bold 18px Verdana", color: "#FFFFFF" }).setDepth(1);

    this.load_questions();

    this.animatePlayer();

    this.touchleft = this.add.rectangle(40, 570, 80, 80).setDepth(1).setInteractive();
    this.touchright = this.add.rectangle(500, 570, 80, 80).setDepth(1).setInteractive();
    this.touchleft.on('pointerdown', () => {
      this.goright = false;
      this.goleft = true;
    });
    this.touchleft.on('pointerup', () => {
      this.goright = false;
      this.goleft = false;
    });
    this.touchright.on('pointerdown', () => {
      this.goright = true;
      this.goleft = false;
    });
    this.touchright.on('pointerup', () => {
      this.goright = false;
      this.goleft = false;
    });

    let totalVidas = 3;
    let displacement = 60;
    let firstPosition = 520 - ((totalVidas - 1) * displacement);
    this.vidas = this.physics.add.staticGroup({
      setScale: { x: 0.5, y: 0.5 },
      key: 'vidas',
      frameQuantity: totalVidas - 1,
      gridAlign: {
        width: totalVidas - 1,
        height: 1,
        cellWidth: displacement,
        cellHeight: 30,
        x: firstPosition,
        y: 4
      }
    }).setDepth(1);
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
          this.balloon_ok = this.add.image(this.player.x, this.player.y - 90, 'balloon_ok');
          // this.scene.start('BalloonOk', {"respueta": 1 });

        } else {
          this.player.anims.play('fail');
          this.balloon_fail = this.add.image(this.player.x, this.player.y - 90, 'balloon_fail');
          let sinVidas = this.accionVidas();
          if (sinVidas) {
            this.results();
          } else {
            // this.cuadroMensajes = this.add.image(270, 380, 'cuadroMensajes');
            // this.player.visible = false;
            // this.balloon.visible = false;
            // this.checkers.visible = false;
            // this.ground.visible = false;
            // this.scene.start('Incorrecto', {"scene": this});
          }
        }
      }, 166);
      setTimeout(() => {
        if (this.mode == 1) {
          this.pills.clear(true, true);
          if (this.answer == this.correctAnswer) {
            this.check(this.question_id, true);
            this.right++;
            console.log(this.right);
          } else {
            this.check(this.question_id, false);
          }
          this.next_question();
        }
      }, 500);

    } else if (this.cursors.left.isDown || this.goleft) {
      this.player.setVelocityX(-220);
      this.player.setVelocityY(0);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown || this.goright) {
      this.player.setVelocityX(220);
      this.player.setVelocityY(0);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn')
    }

    if (time > this.respawn) {
      this.pillsFalling();
      this.respawn += 2000;
    }

    this.pillCollition = false;
  }

  animatePlayer() {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dependientesprite', { start: 3, end: 1 }), // prueba
      // frames: this.anims.generateFrameNumbers('dependientesprite', { start: 5, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dependientesprite', frame: 4 }], // prueba
      // frames: [{ key: 'dependientesprite', frame: 10 }],
      frameRate: 4
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dependientesprite', { start: 5, end: 7 }), // prueba
      // frames: this.anims.generateFrameNumbers('dependientesprite', { start: 15, end: 17 }),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'eatFromRight',
      frames: [{ key: 'dependientesprite', frame: 8 }], // prueba
      // frames: [{ key: 'dependientesprite', frame: 20 }],
      frameRate: 4,
      duration: 500
    });

    this.anims.create({
      key: 'eatFromLeft',
      frames: [{ key: 'dependientesprite', frame: 0 }],
      frameRate: 4,
      duration: 500
    });

    this.anims.create({
      key: 'fail',
      frames: [{ key: 'dependientesprite', frame: 9 }], // prueba
      // frames: [{ key: 'dependientesprite', frame: 20 }],
      frameRate: 4,
      duration: 500
    });

    this.anims.create({
      key: 'correct',
      frames: [{ key: 'dependientesprite', frame: 10 }], // prueba
      // frames: [{ key: 'dependientesprite', frame: 0 }],
      frameRate: 4,
      duration: 500
    });
  }

  pillsFalling() {
    var pill = this.pills.get(this.getRandomInt(50, 490), -68).setCircle(2, 0, 120);
    pill.answer = this.getRandomInt(1, 3);
    pill.setFrame(pill.answer - 1);
  }

  eatPill(player, pill) {
    this.answer = pill.answer;
    this.pillCollition = true;
    this.sideCollition = player.x > pill.x ? 1 : 0;
    this.swallow.play();
    this.bg_audio.pause();
    pill.destroy();
    this.goright = false;
    this.goleft = false;
  }

  next_question() {
    if (this.question_id < 5) {
      this.load_questions();
      if (this.balloon_ok) { this.balloon_ok.destroy(); }
      if (this.balloon_fail) { this.balloon_fail.destroy(); }
      this.scene.resume('Firstscene');
      this.bg_audio.resume();
      this.background.setTexture(this.backgrounds[this.question_id], 0);
      this.question_id++;
    } else {
      this.results();
    }
  }

  results() {
    if (this.mode) {
      this.score = this.right * 20;
      let imagen = this.celebracion;
      if (this.score < 60) {
        imagen = this.perdiste;
      }
      this.scene.start('Resultado', {
        'respuesta': 1,
        'score': this.score,
        "right": this.right,
        "imagen": imagen
      });
    }
  }

  check(id, state) {
    if (state) {
      this.checkers[id - 1].setFrame(2);
    } else {
      this.checkers[id - 1].setFrame(1);
    }
  }

  load_questions() {
    let pregunta_index = this.getRandomInt(0, config.data.length - 1);
    let item = config.data.splice(pregunta_index, 1)[0];
    this.pregunta.setText(item.pregunta);
    this.respuesta1.setText(item.respuesta.uno);
    this.respuesta2.setText(item.respuesta.dos);
    this.respuesta3.setText(item.respuesta.tres);
    this.mundo.setText('Mundo ');
    this.correctAnswer = item.correcta
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  accionVidas() {
    if (this.vidas.countActive() == 0) {
      return true;
    }
    let currentLiveLost = this.vidas.getFirstAlive();
    currentLiveLost.disableBody(true, true);
    return false;
  }

  darMundo(nivel) {
    let nombreMundo = 'Tradicional';
    if (nivel == 1) {
        // nomb
    }
  }
}

export default Firstscene;
