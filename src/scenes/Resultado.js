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
        this.load.image('bghome', 'assets/jgb/home.png');
        this.load.image('tablero', 'assets/jgb/tablero.png');
        this.load.image('tablero1', 'assets/jgb/tablero_1.png');
        this.load.image('texto', 'assets/jgb/sigiente_nivel_texto.png');
        this.load.image('ganaste', 'assets/jgb/ganaste.png');
        this.load.image('perdiste', 'assets/jgb/sigue_intentando.png');
        this.load.image('imagen', this.imagen);
    
        this.load.spritesheet('btnScore', 'assets/jgb/boton_ver_score.png', { frameWidth: 364, frameHeight: 90 });
        this.load.spritesheet('btnReintentar', 'assets/jgb/boton_reintentar.png', { frameWidth: 364, frameHeight: 94 });
    }
  
    async create(){
        this.background = this.add.image(270, 380, 'bghome');
        this.tablero = this.add.image(270, 370, 'tablero');
        if (this.accion) {
            this.actualizarNivel();
            this.ganaste = this.add.image(270, 315, 'ganaste');
            let totalPuntos = await this.mostrarPuntos();
            this.mensaje = this.add.text(150, 348, 'Puntos optenidos '+this.score + " pts.\n     Total puntos "+totalPuntos, { fontFamily: 'Rammetto One', fontSize: '28px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
            // this.mensaje = this.add.text(150, 348, this.score + " pts. / " + this.right + " respuestas \n    correctas de 5", { fontFamily: 'Rammetto One', fontSize: '28px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
            this.imagen = this.add.image(270, 530, 'imagen');
            this.btnScore = this.add.sprite(270, 730, 'btnScore').setInteractive();
            this.btnScore.on('pointerover', () => {
                this.btnScore.setFrame(1);
            }).on('pointerout', () => {
                this.btnScore.setFrame(0);
            }).on('pointerdown', () => {
                this.imagen.destroy();
                this.actualizarNivel();
                this.scene.start("Score");
            });
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