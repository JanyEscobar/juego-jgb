class Homescene extends Phaser.Scene {
  constructor(){
    super("Homescene");
  }

  // init(){
  // }

  preload(){
    this.load.image('bghome', 'assets/jgb/home.png');
    this.load.image('logo', 'assets/jgb/logo_TR.png');
    this.load.image('seleccion', 'assets/jgb/Titulo.png');

    this.load.image('nombres', 'assets/jgb/nombres.png');
    this.load.spritesheet('niñosprite', 'assets/jgb/spriteNiño.png', { frameWidth: 230, frameHeight: 200 });
    this.load.spritesheet('niñasprite', 'assets/jgb/spriteNiña.png', { frameWidth: 225, frameHeight: 210 });
    this.load.spritesheet('comenzarsprite', 'assets/jgb/spriteSiguiente.png', { frameWidth: 364, frameHeight: 94 });
  }

  create(){
    this.time = 0;

    this.background = this.add.image(270, 380, 'bghome');
    this.logo = this.add.image(270, 105, 'logo');
    this.seleccion = this.add.image(270, 240, 'seleccion');
    this.niño = this.add.sprite(164, 410, 'niñosprite').setInteractive();
    this.niña = this.add.sprite(370, 385, 'niñasprite').setInteractive();
    this.comenzarBtn = this.add.sprite(270, 640, 'comenzarsprite').setInteractive();
    this.nombres = this.add.image(270, 550, "nombres");

    let personaje = 1;
    // let personaje = 'assets/jgb/Sprites_boy.png';
    // let celebracion = 'assets/jgb/celebracion_niño.png';

    this.niño.on('pointerover', () => {
      this.niño.setFrame(1);
    }).on('pointerout', () => {
      if(this.niña.frame == 1){
        this.niño.setFrame(0);
      }
    }).on('pointerdown', () => {
      this.niño.setFrame(1);
      this.niña.setFrame(0);
      personaje = 1;
      // personaje = 'assets/jgb/Sprites_boy.png';
    })

    this.niña.on('pointerover', () => {
      this.niña.setFrame(1);
    }).on('pointerout', () => {
      if(this.niño.frame == 1){
        this.niña.setFrame(0);
      }      
    }).on('pointerdown', () => {
      this.niña.setFrame(1);
      this.niño.setFrame(0);
      console.log(1);
      personaje = 2;
      // personaje = 'assets/dependientesprite_mujer.png';
    })
    
    this.comenzarBtn.on('pointerover', () => {
      this.comenzarBtn.setFrame(1);
    }).on('pointerout', () => {
      this.comenzarBtn.setFrame(0);
    }).on('pointerdown', () => {      
      this.scene.start("Demo", {
        "path_dependiente": personaje == 1 ? 'assets/jgb/1.png' : 'assets/dependientesprite_mujer.png',
        // "path_dependiente": personaje == 1 ? 'assets/jgb/Sprites_boy.png' : 'assets/dependientesprite_mujer.png',
        "celebracion": personaje == 1 ? 'assets/jgb/celebracion_niño.png' : 'assets/jgb/celebracion_niño.png',
        "perdiste": personaje == 1 ? 'assets/jgb/boy_sad_body.png' : 'assets/jgb/boy_sad_body.png',
        "happy": personaje == 1 ? 'assets/jgb/boy_happy.png' : 'assets/jgb/boy_happy.png',
        "sad": personaje == 1 ? 'assets/jgb/boy_sad.png' : 'assets/jgb/boy_sad.png',
        "personajeDemo": personaje == 1 ? 'assets/jgb/personaje_niño.png' : 'assets/jgb/personaje_niño.png',
        "comenzar": true,
        "time": this.time
      });
    });
  }

  // update(time, delta){
  //   // this.time = time;
  // }
}

export default Homescene;