class Homescene extends Phaser.Scene {
  constructor(){
    super("Homescene");
  }

  init(data){
    this.demo = data.demo ?? false;
    this.nivel = data.nivel ?? 1;
    this.id = data.id;
  }

  preload(){
    this.load.image('bghomescene', 'assets/home1.png');
    this.load.image('logo', 'assets/logo_TR.png');
    this.load.image('seleccion', 'assets/Titulo.png');

    this.load.image('nombres', 'assets/nombres.png');
    this.load.spritesheet('ninosprite', 'assets/spriteNino.png', { frameWidth: 213, frameHeight: 210 });
    this.load.spritesheet('ninasprite', 'assets/spriteNina.png', { frameWidth: 213, frameHeight: 210 });
    this.load.spritesheet('comenzarsprite', 'assets/btnSiguiente.png', { frameWidth: 364, frameHeight: 94 });
  }

  create(){
    this.time = 0;

    this.background = this.add.image(270, 500, 'bghomescene');
    // this.background.setScale(1, 1.25);
    this.background.setScale(1, this.game.scale.height * 0.0014);
    this.logo = this.add.image(270, 150, 'logo');
    this.logo.setScale(2, 2);
    this.seleccion = this.add.image(270, 360, 'seleccion');
    this.nino = this.add.sprite(164, 530, 'ninosprite').setInteractive();
    // this.nino.setFrame(1);
    this.nina = this.add.sprite(370, 530, 'ninasprite').setInteractive();
    this.comenzarBtn = this.add.sprite(270, 760, 'comenzarsprite').setInteractive();
    this.nombres = this.add.image(270, 680, "nombres");

    let personaje = 0;

    this.nino.on('pointerover', () => {
      // this.nino.setFrame(1);
    }).on('pointerout', () => {
      if(this.nina.frame == 1){
        this.nino.setFrame(0);
      }
    }).on('pointerdown', () => {
      this.nina.setFrame(0);
      this.nino.setFrame(1);
      personaje = 1;
    })

    this.nina.on('pointerover', () => {
      // this.nina.setFrame(1);
    }).on('pointerout', () => {
      if(this.nino.frame == 1){
        this.nina.setFrame(0);
      }
    }).on('pointerdown', () => {
      this.nino.setFrame(0);
      this.nina.setFrame(1);
      personaje = 2;
    })
    
    this.comenzarBtn.on('pointerover', () => {
      // this.comenzarBtn.setFrame(1);
    }).on('pointerout', () => {
      // this.comenzarBtn.setFrame(0);
    }).on('pointerdown', () => {
      if (personaje) {
        let variables = {
          "path_dependiente": personaje == 1 ? 'assets/Sprites_boy.png' : 'assets/Sprites_gril.png',
          "celebracion": personaje == 1 ? 'assets/celebracion_nino.png' : 'assets/celebracion_nina.png',
          "perdiste": personaje == 1 ? 'assets/boy_sad_body.png' : 'assets/girl_sad_body.png',
          "happy": personaje == 1 ? 'assets/boy_happy.png' : 'assets/girl_happy.png',
          "sad": personaje == 1 ? 'assets/boy_sad.png' : 'assets/girl_sad.png',
          "personajeDemo": personaje == 1 ? 'assets/sprite_boy_milk1.png' : 'assets/sprite_girl_milk1.png',
          "comenzar": true,
          "time": this.time,
          "nivel": this.nivel,
          "id": this.id,
          "personaje": personaje,
        };
        if (!this.demo) {
          this.scene.start("Demo", variables);
        } else {
          this.scene.start("Game", variables);
        }
      } else {
        alert('Por favor seleccione un personaje');
      }
    });
  }
}

export default Homescene;