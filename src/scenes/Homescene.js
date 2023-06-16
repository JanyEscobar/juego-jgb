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
    this.load.image('bghomescene', 'assets/jgb/home.png');
    this.load.image('logo', 'assets/jgb/logo_TR.png');
    this.load.image('seleccion', 'assets/jgb/Titulo.png');

    this.load.image('nombres', 'assets/jgb/nombres.png');
    this.load.spritesheet('niñosprite', 'assets/jgb/spriteNiño.png', { frameWidth: 230, frameHeight: 230 });
    this.load.spritesheet('niñasprite', 'assets/jgb/spriteNiña.png', { frameWidth: 225, frameHeight: 230 });
    this.load.spritesheet('comenzarsprite', 'assets/jgb/btnSiguiente.png', { frameWidth: 364, frameHeight: 94 });
  }

  create(){
    this.time = 0;

    this.background = this.add.image(270, 380, 'bghomescene');
    this.logo = this.add.image(270, 105, 'logo');
    this.seleccion = this.add.image(270, 240, 'seleccion');
    this.niño = this.add.sprite(164, 385, 'niñosprite').setInteractive();
    this.niña = this.add.sprite(370, 385, 'niñasprite').setInteractive();
    this.comenzarBtn = this.add.sprite(270, 640, 'comenzarsprite').setInteractive();
    this.nombres = this.add.image(270, 550, "nombres");

    let personaje = 1;

    this.niño.on('pointerover', () => {
      // this.niño.setFrame(1);
    }).on('pointerout', () => {
        // this.niño.setFrame(0);
    }).on('pointerdown', () => {
      // this.niño.setFrame(1);
      personaje = 1;
    })

    this.niña.on('pointerover', () => {
      // this.niña.setFrame(1);
    }).on('pointerout', () => {
        // this.niña.setFrame(0);
    }).on('pointerdown', () => {
      // this.niña.setFrame(1);
      personaje = 2;
    })
    
    this.comenzarBtn.on('pointerover', () => {
      // this.comenzarBtn.setFrame(1);
    }).on('pointerout', () => {
      // this.comenzarBtn.setFrame(0);
    }).on('pointerdown', () => {
      let variables = {
        "path_dependiente": personaje == 1 ? 'assets/jgb/Sprites_boy.png' : 'assets/jgb/Sprites_gril.png',
        "celebracion": personaje == 1 ? 'assets/jgb/celebracion_niño.png' : 'assets/jgb/celebracion_niña.png',
        "perdiste": personaje == 1 ? 'assets/jgb/boy_sad_body.png' : 'assets/jgb/girl_sad_body.png',
        "happy": personaje == 1 ? 'assets/jgb/boy_happy.png' : 'assets/jgb/girl_happy.png',
        "sad": personaje == 1 ? 'assets/jgb/boy_sad.png' : 'assets/jgb/girl_sad.png',
        "personajeDemo": personaje == 1 ? 'assets/jgb/sprite_boy_milk1.png' : 'assets/jgb/sprite_girl_milk1.png',
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
    });
  }
}

export default Homescene;