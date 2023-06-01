class Home extends Phaser.Scene {
    constructor(){
      super("Home");
    }
  
    // init(){
    // }
  
    preload(){
        this.load.image('bghome', 'assets/jgb/home.png');
        this.load.image('logo', 'assets/jgb/logo_TR.png');
        this.load.image('titulo', 'assets/jgb/bienvenida.png');
        this.load.image('google', 'assets/jgb/google.png');
        this.load.image('outlook', 'assets/jgb/outlook.png');
        this.load.image('powered', 'assets/jgb/powered.png');
    
        this.load.spritesheet('btnEntrar', 'assets/jgb/boton_entrada.png', { frameWidth: 364, frameHeight: 94 });
        this.load.spritesheet('btnRegistrarse', 'assets/jgb/boton_registrarse.png', { frameWidth: 364, frameHeight: 94 });
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    }
  
    create(){
        this.time = 0;
    
        this.background = this.add.image(270, 380, 'bghome');
        this.logo = this.add.image(270, 105, 'logo');
        this.titulo = this.add.image(270, 240, 'titulo');
        let inputEmail = this.add.rexInputText(240, 310, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Usuario',
        });
        let inputClave = this.add.rexInputText(240, 380, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Clave',
        });
         
        this.btnEntrar = this.add.sprite(270, 480, 'btnEntrar').setInteractive();
        this.btnRegistrarse = this.add.sprite(270, 640, 'btnRegistrarse').setInteractive();
        this.btnGoogle = this.add.sprite(170, 570, 'google').setInteractive();
        this.btnOutlook = this.add.sprite(330, 570, 'outlook').setInteractive();
        this.powered = this.add.sprite(270, 763, 'powered').setInteractive();
        
        this.btnEntrar.on('pointerover', () => {
            this.btnEntrar.setFrame(1);
        }).on('pointerout', () => {
            this.btnEntrar.setFrame(0);
        }).on('pointerdown', () => {      
            this.scene.start("Homescene");
        });
        
        this.btnRegistrarse.on('pointerover', () => {
            this.btnRegistrarse.setFrame(1);
        }).on('pointerout', () => {
            this.btnRegistrarse.setFrame(0);
        }).on('pointerdown', () => {      
            this.scene.start("Registro");
        });
    }
  
    // update(time, delta){
    // //   this.time = time;
    // }
  }
  
  export default Home;