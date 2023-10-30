class Homescene extends Phaser.Scene {
  constructor(){
    super("Homescene");
  }

  init(data){
    this.demo = data.demo ?? false;
    this.nivel = data.nivel ?? 1;
    this.id = data.id ?? false;
  }

  preload(){
    this.load.image('bghomescene', 'assets/home1.png');
    this.load.image('logo', 'assets/logo_TR.png');
    this.load.image('seleccion', 'assets/Titulo.png');
    // this.load.video('videoPublicidad3', ['assets/publicidad3.mp4']);

    this.load.image('nombres', 'assets/nombres.png');
    this.load.spritesheet('ninosprite', 'assets/spriteNino.png', { frameWidth: 213, frameHeight: 210 });
    this.load.spritesheet('ninasprite', 'assets/spriteNina.png', { frameWidth: 213, frameHeight: 210 });
    this.load.spritesheet('comenzarsprite', 'assets/btnSiguiente.png', { frameWidth: 340, frameHeight: 160 });
  }

  create(){
    this.time = 0;

    this.background = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.2, 'bghomescene');
    this.background.setScale(window.innerWidth * 0.0023, window.innerHeight * 0.002);
    this.logo = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.15, 'logo');
    this.logo.setScale(1, 1);
    this.logo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.seleccion = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.32, 'seleccion');
    this.seleccion.setScale(window.innerWidth * 0.002, window.innerHeight * 0.0012);
    this.seleccion.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.nino = this.add.sprite(this.cameras.main.width * 0.3, window.innerHeight * 0.54, 'ninosprite').setInteractive();
    this.nino.setScale(window.innerWidth * 0.002, window.innerHeight * 0.0013);
    this.nino.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.nina = this.add.sprite(this.cameras.main.width * 0.7, window.innerHeight * 0.54, 'ninasprite').setInteractive();
    this.nina.setScale(window.innerWidth * 0.002, window.innerHeight * 0.0013);
    this.nina.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.comenzarBtn = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.8, 'comenzarsprite').setInteractive();
    this.comenzarBtn.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
    this.comenzarBtn.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.nombres = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.7, "nombres");
    this.nombres.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);

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
      this.comenzarBtn.setFrame(1);
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
      this.comenzarBtn.setFrame(1);
      personaje = 2;
    })
    
    this.comenzarBtn.on('pointerover', () => {
      this.comenzarBtn.setFrame(1);
    }).on('pointerout', () => {
      this.comenzarBtn.setFrame(0);
    }).on('pointerdown', () => {
      if (personaje) {
        let variables = {
          "path_dependiente": personaje == 1 ? 'assets/Sprites_boy.png' : 'assets/Sprites_gril.png',
          "celebracion": personaje == 1 ? 'assets/celebracion_nino.png' : 'assets/celebracion_nina.png',
          "perdiste": personaje == 1 ? 'assets/boy_sad_body.png' : 'assets/girl_sad_body.png',
          "happy": personaje == 1 ? 'assets/boy_happy.png' : 'assets/girl_happy.png',
          "sad": personaje == 1 ? 'assets/boy_sad.png' : 'assets/girl_sad.png',
          "personajeDemo": personaje == 1 ? 'assets/sprite_boy_milk1.png' : 'assets/sprite_girl_milk1.png',
          "time": this.time,
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