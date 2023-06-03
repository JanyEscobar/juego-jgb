class Resultado extends Phaser.Scene {
    constructor(){
      super("Resultado");
    }
  
    init(data){
        this.accion = data.respuesta;
        this.score = data.score ?? 0;
        this.right = data.right ?? 0;
        this.imagen = data.imagen ?? '';
    }
  
    preload(){
        this.load.image('bghome', 'assets/jgb/home.png');
        this.load.image('tablero', 'assets/jgb/tablero.png');
        this.load.image('tablero1', 'assets/jgb/tablero_1.png');
        this.load.image('texto', 'assets/jgb/sigiente_nivel_texto.png');
        this.load.image('ganaste', 'assets/jgb/ganaste.png');
        this.load.image('perdiste', 'assets/jgb/sigue_intentando.png');
        this.load.image('imagen', this.imagen);
    
        this.load.spritesheet('btnSiguiente', 'assets/jgb/spriteSiguiente.png', { frameWidth: 364, frameHeight: 94 });
        this.load.spritesheet('btnReintentar', 'assets/jgb/boton_reintentar.png', { frameWidth: 364, frameHeight: 94 });
    }
  
    create(){
        this.background = this.add.image(270, 380, 'bghome');
        this.tablero = this.add.image(270, 370, 'tablero');
        if (this.accion) {
            this.ganaste = this.add.image(270, 315, 'ganaste');
            this.mensaje = this.add.text(150, 348, this.score + " pts. / " + this.right + " respuestas \n    correctas de 5", { fontFamily: 'Rammetto One', fontSize: '28px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
            this.imagen = this.add.image(270, 530, 'imagen');
        } else {
            this.tablero.setTexture('tablero1', 0);
            this.perdiste = this.add.image(270, 290, 'perdiste');
            this.imagen = this.add.image(250, 440, 'imagen');
            this.btnReintentar = this.add.sprite(270, 700, 'btnReintentar').setInteractive();
            this.btnReintentar.on('pointerover', () => {
                this.btnReintentar.setFrame(1);
            }).on('pointerout', () => {
                this.btnReintentar.setFrame(0);
            }).on('pointerdown', () => {      
                this.scene.start("Game");
            });
        }
    }
  }
  
  export default Resultado;