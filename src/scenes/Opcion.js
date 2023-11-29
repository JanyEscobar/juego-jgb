class Opcion extends Phaser.Scene {
    constructor(){
      super("Opcion");
    }

    init(data){
        this.demo = data.demo ?? false;
        this.nivel = data.nivel ?? 1;
        this.id = data.id ?? false;
    }

    preload(){
        this.load.image('bghome', 'assets/home1.png');
        this.load.image('logo', 'assets/logo_TR.png');
        this.load.image('seleccion', 'assets/seleccion_mundo.png');
        this.load.image('powered', 'assets/powered.png');
        // this.load.video('videoPublicidad2', ['assets/publicidad2.mp4']);

        this.load.spritesheet('btnEdicativo', 'assets/mundo_educativo.png', { frameWidth: 400, frameHeight: 250 });
        this.load.spritesheet('btnMiniJuegos', 'assets/mini_mundos.png', { frameWidth: 380, frameHeight: 250 });
    }
  
    create(){
        this.background = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.2, 'bghome');
        this.background.setScale(window.innerWidth * 0.0023, window.innerHeight * 0.002);
        this.logo = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.15, 'logo');
        this.logo.setScale(1, 1);
        this.logo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.seleccion = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.3, 'seleccion');
        this.seleccion.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0015);
        this.seleccion.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        // this.powered = this.add.image(this.cameras.main.width / 2, this.cameras.main.height - 15, 'powered');
        this.powered = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.975, 'powered');
        this.powered.setScale(window.innerWidth * 0.003, window.innerHeight * 0.0015);
        this.powered.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
         
        this.btnEdicativo = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.5, 'btnEdicativo').setDepth(1).setInteractive();
        this.btnEdicativo.setScale(window.innerWidth * 0.002, window.innerHeight * 0.0012);
        this.btnEdicativo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.btnMiniJuegos = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.74, 'btnMiniJuegos').setDepth(1).setInteractive();
        this.btnMiniJuegos.setScale(window.innerWidth * 0.002, window.innerHeight * 0.0012);
        this.btnMiniJuegos.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        
        this.btnEdicativo.on('pointerover', () => {
            this.btnEdicativo.setFrame(0);
        }).on('pointerout', () => {
            this.btnEdicativo.setFrame(1);
        }).on('pointerdown', () => {
            this.btnEdicativo.setFrame(1);
            this.btnMiniJuegos.setFrame(0);
            this.scene.start("Homescene", {
                demo: this.demo,
                nivel: this.nivel,
                id: this.id,
            });
        });

        this.btnMiniJuegos.on('pointerover', () => {
            this.btnMiniJuegos.setFrame(0);
        }).on('pointerout', () => {
            this.btnMiniJuegos.setFrame(1);
        }).on('pointerdown', () => {
            this.btnMiniJuegos.setFrame(1);
            this.btnEdicativo.setFrame(0);
        });
    }
  }
  
  export default Opcion;