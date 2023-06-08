import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from "../../node_modules/firebase/firebase-firestore.js";

class Score extends Phaser.Scene {
    constructor(){
      super("Score");
    }
  
    init(data){
        this.id = data.id;
    }
  
    preload(){
        this.load.image('bghome', 'assets/jgb/home.png');
        this.load.image('tablero', 'assets/jgb/tablero.png');
        this.load.image('textoResultados', 'assets/jgb/Resultados.png');
        this.load.image('card', 'assets/jgb/card.png');
        this.load.image('por_defecto', 'assets/jgb/por_defecto.png');
    
        this.load.spritesheet('btnReintentar', 'assets/jgb/boton_reintentar.png', { frameWidth: 364, frameHeight: 94 });
    }
  
    async create(){
        this.background = this.add.image(270, 380, 'bghome');
        this.tablero = this.add.image(270, 370, 'tablero');
        this.textoResultados = this.add.image(270, 315, 'textoResultados');
        this.cards = this.physics.add.staticGroup({
            setScale: { x: 1, y: 0.7 },
            key: 'card',
            frameQuantity: 5,
            gridAlign: {
                width: 5,
                height: 0,
                x: 100,
                y: 380
            }
        }).setDepth(1);
        let posY = 380; // Posición inicial en el eje Y
        let info = await this.consultarUsuarios();
        this.cards.getChildren().forEach((elemento, index) => {
            elemento.y = posY;
            this.add.image(130, elemento.y, 'por_defecto').setDepth(1).setScrollFactor(1.5);
            this.add.text(160, elemento.y - 10, info[index][0], { fontFamily: 'Arial Black', fontSize: '20px', fontStyle: 'normal', color: '#000000' }).setDepth(1);
            this.add.text(380, elemento.y - 10, info[index][1], { fontFamily: 'Arial Black', fontSize: '20px', fontStyle: 'normal', color: '#000000' }).setDepth(1);
            posY += elemento.height - 2;
        });
        // this.mensaje = this.add.text(100, 350, info, { fontFamily: 'Arial Black', fontSize: '28px', fontStyle: 'normal', color: '#FFFFFF' }).setDepth(1);
        this.btnReintentar = this.add.sprite(270, 730, 'btnReintentar').setInteractive();
        this.btnReintentar.on('pointerover', () => {
            this.btnReintentar.setFrame(1);
        }).on('pointerout', () => {
            this.btnReintentar.setFrame(0);
        }).on('pointerdown', () => {      
            this.scene.start("Game", {nivel: 1});
        });
    }

    async consultarUsuarios() {
        let db = this.configData();
        let usuarios = collection(db, "usuarios");
        let datos = query(usuarios, orderBy("puntos", "desc"), limit(5));
        let querySnapshot = await getDocs(datos);
        let info = [];
        querySnapshot.forEach((doc) => {
            let nombre = doc.data().nombre;
            if (nombre.length > 13) {
                nombre = nombre.substr(0, 13)+'...';
            }
            info.push([nombre, doc.data().puntos]);
        });
        return info;
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
  
  export default Score;