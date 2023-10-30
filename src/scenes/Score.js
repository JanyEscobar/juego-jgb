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
        this.load.image('bgScore', 'assets/home.png');
        this.load.image('tablero', 'assets/tablero.png');
        this.load.image('textoResultados', 'assets/Resultados.png');
        this.load.image('card', 'assets/card.png');
        this.load.image('por_defecto', 'assets/por_defecto.png');
    
        this.load.spritesheet('btnReintentar', 'assets/btnReintentar.png', { frameWidth: 364, frameHeight: 94 });
    }
  
    async create(){
        this.background = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.2, 'bgScore');
        this.background.setScale(window.innerWidth * 0.0023, window.innerHeight * 0.002);
        this.tablero = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.45, 'tablero');
        this.tablero.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.tablero.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.textoResultados = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.37, 'textoResultados');
        this.textoResultados.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.textoResultados.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.cards = this.physics.add.staticGroup({
            setScale: { x: window.innerWidth * 0.0019, y: window.innerHeight * 0.0008 },
            key: 'card',
            frameQuantity: 5,
            gridAlign: {
                width: 5,
                height: 0,
                x: this.cameras.main.width / 8.95,
                y: window.innerHeight * 0.45
            }
        }).setDepth(1);
        let posY = window.innerHeight * 0.45; // Posición inicial en el eje Y
        let info = await this.consultarUsuarios();
        this.cards.getChildren().forEach((elemento, index) => {
            elemento.y = posY;
            this.add.image(this.cameras.main.width * 0.25, elemento.y + 1, 'por_defecto').setDepth(1).setScrollFactor(1.5).setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
            this.add.text(this.cameras.main.width * 0.3, elemento.y - 10, info[index][0], { fontFamily: 'sans-serif', fontSize: '20px', fontStyle: 'normal', color: '#000000' })
                .setDepth(1).setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012)
                .texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            this.add.text(this.cameras.main.width * 0.7, elemento.y - 10, info[index][1], { fontFamily: 'sans-serif', fontSize: '20px', fontStyle: 'normal', color: '#000000' })
                .setDepth(1).setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012)
                .texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            posY += elemento.height - 18;
        });
        this.btnReintentar = this.add.sprite(this.cameras.main.width / 2, window.innerHeight * 0.93, 'btnReintentar').setInteractive();
        this.btnReintentar.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.btnReintentar.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.btnReintentar.on('pointerover', () => {
            // this.btnReintentar.setFrame(1);
        }).on('pointerout', () => {
            // this.btnReintentar.setFrame(0);
        }).on('pointerdown', () => {      
            this.scene.start("Homescene");
            // this.scene.start("Game");
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