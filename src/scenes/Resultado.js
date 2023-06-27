import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { doc, updateDoc, getFirestore, getDoc } from "../../node_modules/firebase/firebase-firestore.js";

class Resultado extends Phaser.Scene {
    constructor(){
      super("Resultado");
    }
  
    init(data){
        this.accion = data.respuesta;
        this.score = data.score ?? 0;
        this.right = data.right ?? 0;
        this.imagen = data.imagen ?? '';
        this.id = data.id;
    }
  
    preload(){
        this.load.image('bgResultado', 'assets/home.png');
        this.load.image('tablero', 'assets/tablero.png');
        this.load.image('tablero1', 'assets/tablero1.png');
        this.load.image('texto', 'assets/sigiente_nivel_texto.png');
        this.load.image('ganaste', 'assets/ganaste.png');
        this.load.image('perdiste', 'assets/mensaje_sin_vidas.png');
        this.load.image('noTeRindas', 'assets/no_te_rindas.png');
        this.load.image('imagen', this.imagen);
    
        this.load.spritesheet('btnScore', 'assets/btnScore.png', { frameWidth: 364, frameHeight: 90 });
        this.load.spritesheet('btnReintentar', 'assets/btnReintentar.png', { frameWidth: 364, frameHeight: 94 });
    }
  
    async create(){
        this.background = this.add.image(270, 380, 'bgResultado');
        this.tablero = this.add.image(270, 370, 'tablero');
        this.scene.pause();
        this.actualizarNivel();
        this.scene.resume('Resultado');
        if (this.accion) {
            this.ganaste = this.add.image(270, 300, 'ganaste');
            let totalPuntos = await this.mostrarPuntos();
            this.mensaje = this.add.text(150, 348, "Total puntos "+totalPuntos, { fontFamily: 'Arial Black', fontSize: '28px', fontStyle: 'normal', color: '#B70E0C' }).setDepth(1);
            this.imagen = this.add.image(270, 530, 'imagen');
            this.btnScore = this.add.sprite(270, 730, 'btnScore').setInteractive();
            this.btnScore.on('pointerover', () => {
                // this.btnScore.setFrame(1);
            }).on('pointerout', () => {
                // this.btnScore.setFrame(0);
            }).on('pointerdown', () => {
                this.imagen.destroy();
                this.scene.start("Score");
            });
        } else {
            this.tablero.setTexture('tablero1', 0);
            this.perdiste = this.add.image(270, 260, 'perdiste');
            this.noTeRindas = this.add.image(270, 340, 'noTeRindas');
            this.imagen = this.add.image(270, 530, 'imagen');
            this.btnReintentar = this.add.sprite(270, 730, 'btnReintentar').setInteractive();
            this.btnReintentar.on('pointerover', () => {
                // this.btnReintentar.setFrame(1);
            }).on('pointerout', () => {
                // this.btnReintentar.setFrame(0);
            }).on('pointerdown', () => {
                this.imagen.destroy();
                this.scene.start("Game");
            });
        }
    }

    async actualizarNivel() {
        let db = this.configData();
        let washingtonRef = doc(db, "usuarios", this.id);
        await updateDoc(washingtonRef, {
            nivel: 1
        });
    }

    async mostrarPuntos() {
        let db = this.configData();
        let docRef = doc(db, "usuarios", this.id);
        let docSnap = await getDoc(docRef);
        return docSnap.data().puntos;
    }

    configData() {
        let firebaseConfig = {
            apiKey: "AIzaSyBRtGvmHjHUHksWz_3LD4Xk998GCJBWZwU",
            authDomain: "juego-jgb-54a43.firebaseapp.com",
            projectId: "juego-jgb-54a43",
            storageBucket: "juego-jgb-54a43.appspot.com",
            messagingSenderId: "809198562223",
            appId: "1:809198562223:web:6958a36d10fc3f9a551d5a",
            measurementId: "G-W01GKVNYE0"
        };
        let app = initializeApp(firebaseConfig);
        let db = getFirestore(app);
        return db;
    }
  }
  
  export default Resultado;