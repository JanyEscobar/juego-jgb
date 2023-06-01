class Registro extends Phaser.Scene {
    constructor(){
      super("Registro");
    }
  
    init(){
    }
  
    preload(){
        this.load.image('bghome', 'assets/jgb/home.png');
        this.load.image('powered', 'assets/jgb/powered.png');
        this.load.spritesheet('btnEntrar', 'assets/jgb/boton_entrada.png', { frameWidth: 364, frameHeight: 94 });
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    }
  
    create(){
        this.time = 30;
    
        this.background = this.add.image(270, 380, 'bghome');
        this.btnEntrar = this.add.sprite(270, 540, 'btnEntrar').setInteractive();
        this.powered = this.add.sprite(270, 763, 'powered').setInteractive();
        let inputEmail = this.add.rexInputText(240, 240, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Email',
        });
        let inputNombre = this.add.rexInputText(240, 310, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Nombre',
        });
        let inputCiudad = this.add.rexInputText(240, 380, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Ciudad',
        });

        var selectElement = document.createElement("select");
        var option1 = document.createElement("option");
        var option2 = document.createElement("option");
        var option3 = document.createElement("option");
        var option4 = document.createElement("option");
        option1.text = "Dependiente";
        option2.text = "Medico";
        option3.text = "Transferencista";
        option4.text = "Visitate";
        selectElement.add(option1);
        selectElement.add(option2);
        selectElement.add(option3);
        selectElement.add(option4);
        this.add.dom(240, 450, selectElement).setOrigin(0.5);
        
        this.btnEntrar.on('pointerover', () => {
            this.btnEntrar.setFrame(1);
        }).on('pointerout', () => {
            this.btnEntrar.setFrame(0);
        }).on('pointerdown', () => {      
            this.scene.start("Homescene");
        });   
    }
  
    update(time, delta){
      this.time = time;
    }
  }
  
  export default Registro;