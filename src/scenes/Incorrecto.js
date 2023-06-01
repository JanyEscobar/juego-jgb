class Incorrecto extends Phaser.Scene {
    constructor(){
      super("Incorrecto");
    }
  
    init(data){
        this.escena = data.scene;
    }
  
    preload(){
        // this.load.image('bghome', 'assets/jgb/home.png');
        this.load.image('cuadroMensajes', 'assets/jgb/cuadro_mensajes.png');
    
        // this.load.spritesheet('btnSiguiente', 'assets/jgb/spriteSiguiente.png', { frameWidth: 364, frameHeight: 94 });
    }
  
    create(){
        this.cuadroMensajes = this.add.image(270, 380, 'cuadroMensajes');
    }
  }
  
  export default Incorrecto;