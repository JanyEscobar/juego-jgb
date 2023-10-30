import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { doc, updateDoc, getFirestore, getDoc } from "../../node_modules/firebase/firebase-firestore.js";

class Resultado extends Phaser.Scene {
    constructor(){
      super("Resultado");
    }
  
    init(data){
        this.accion = data.respuesta;
        this.score = data.score ?? 0;
        this.imagen = data.imagen ?? '';
        this.id = data.id;
        this.puntos = data.puntos;
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
        this.background = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.2, 'bgResultado');
        this.background.setScale(window.innerWidth * 0.0023, window.innerHeight * 0.002);
        this.tablero = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.45, 'tablero');
        this.tablero.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.tablero.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.scene.pause();
        if (this.id) {
            this.actualizarNivel();
        }
        this.scene.resume('Resultado');
        if (this.accion) {
            this.ganaste = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.37, 'ganaste');
            this.ganaste.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.ganaste.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            let totalPuntos = this.puntos;
            if (this.id) {
                totalPuntos = await this.mostrarPuntos();
            }
            this.mensaje = this.add.text(this.cameras.main.width * 0.3, window.innerHeight * 0.45, "Total puntos "+totalPuntos, { fontFamily: 'sans-serif', fontSize: '28px', fontStyle: 'normal', color: '#B70E0C' }).setDepth(1);
            this.mensaje.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0015);
            this.mensaje.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.imagen = this.add.image(this.cameras.main.width * 0.5, window.innerHeight * 0.65, 'imagen');
            this.imagen.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0011);
            this.imagen.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            if (this.id) {
                this.btnScore = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.93, 'btnScore').setInteractive();
            } else {
                this.btnScore = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.93, 'btnReintentar').setInteractive();
            }
            this.btnScore.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.btnScore.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.btnScore.on('pointerover', () => {
                // this.btnScore.setFrame(1);
            }).on('pointerout', () => {
                // this.btnScore.setFrame(0);
            }).on('pointerdown', () => {
                this.imagen.destroy();
                if (this.id) {
                    this.scene.start("Score");
                } else {
                    this.scene.start("Homescene");
                }
            });
        } else {
            this.tablero.setTexture('tablero1', 0);
            this.perdiste = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.315, 'perdiste');
            this.perdiste.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0015);
            this.perdiste.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.noTeRindas = this.add.image(this.cameras.main.width * 0.5, window.innerHeight * 0.43, 'noTeRindas');
            this.noTeRindas.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0015);
            this.noTeRindas.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.imagen = this.add.image(this.cameras.main.width * 0.5, window.innerHeight * 0.67, 'imagen');
            this.imagen.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.imagen.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.btnReintentar = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.93, 'btnReintentar').setInteractive();
            this.btnReintentar.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.btnReintentar.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
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