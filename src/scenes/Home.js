import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, onAuthStateChanged } from "../../node_modules/firebase/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "../../node_modules/firebase/firebase-firestore.js";

const provider = new GoogleAuthProvider();
const providerOutlook = new OAuthProvider('microsoft.com');

class Home extends Phaser.Scene {
    constructor(){
      super("Home");
    }

    preload(){
        this.load.video('videoPublicidad1', ['assets/publicidad1.mp4']);
        this.load.video('videoPublicidad2', ['assets/publicidad2.mp4']);
        this.load.video('videoPublicidad3', ['assets/publicidad3.mp4']);
        this.load.video('videoPublicidad4', ['assets/publicidad4.mp4']);
        // this.load.video('nombre', 'ruta/al/video.mp4', 'loadeddata', false, false);
        this.load.image('bghome', 'assets/home1.png');
        this.load.image('logo', 'assets/logo_TR.png');
        this.load.image('bienvenida', 'assets/bienvenidos.png');
        this.load.image('iniciarSesion', 'assets/iniciar_sesion.png');
        this.load.image('btnOmitir', 'assets/btnOmitir.png');
        this.load.image('google', 'assets/btnGoogle.png');
        this.load.image('outlook', 'assets/btnOutlook.png');
        this.load.image('btnRegistrarse', 'assets/btnRegistrar.png');
        this.load.image('powered', 'assets/powered.png');
        // this.load.on('progress', function (value) {
        //     console.log('Cargando');
        // });

        this.load.spritesheet('btnEntrar', 'assets/btnEntrada.png', { frameWidth: 364, frameHeight: 94 });
    }
  
    create(){
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
        let auth = getAuth();
        let db = getFirestore(app);

        // this.validarAutenticacion(auth, db);
        
        this.background = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.2, 'bghome');
        this.background.setScale(window.innerWidth * 0.0023, window.innerHeight * 0.002);
        this.background.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.logo = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.15, 'logo');
        this.logo.setScale(1, 1);
        this.logo.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.bienvenida = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.27, 'bienvenida');
        this.bienvenida.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0015);
        this.bienvenida.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.iniciarSesion = this.add.image(this.cameras.main.width / 2, window.innerHeight * 0.32, 'iniciarSesion');
        this.iniciarSesion.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0015);
        this.iniciarSesion.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        // this.powered = this.add.image(this.cameras.main.width / 2, this.cameras.main.height - 15, 'powered');
        this.powered = this.add.image(this.cameras.main.width / 2, window.innerHeight - 17, 'powered');
        this.powered.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0015);
        this.powered.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        let inputEmail = this.add.rexInputText(this.cameras.main.width * 0.46, window.innerHeight * 0.38, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Usuario',
            id: 'inputEmail',
            autoComplete: true,
        });
        inputEmail.setScale(window.innerWidth * 0.002, window.innerHeight * 0.0012);
        let inputClave = this.add.rexInputText(this.cameras.main.width * 0.46, window.innerHeight * 0.46, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Clave',
            type: 'password',
            id: 'inputClave',
            autoComplete: true,
        });
        inputClave.setScale(window.innerWidth * 0.002, window.innerHeight * 0.0012);
         
        this.btnEntrar = this.add.sprite(this.cameras.main.width * 0.52, window.innerHeight * 0.6, 'btnEntrar').setDepth(1).setInteractive();
        this.btnEntrar.setScale(window.innerWidth * 0.002, window.innerHeight * 0.0012);
        this.btnEntrar.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.btnRegistrarse = this.add.image(this.cameras.main.width * 0.68, window.innerHeight * 0.7, 'btnRegistrarse').setDepth(1).setInteractive();
        this.btnRegistrarse.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.btnRegistrarse.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.btnGoogle = this.add.image(this.cameras.main.width * 0.3, window.innerHeight * 0.7, 'google').setInteractive();
        this.btnGoogle.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.btnGoogle.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.btnOutlook = this.add.image(this.cameras.main.width * 0.45, window.innerHeight * 0.7, 'outlook').setInteractive();
        this.btnOutlook.setScale(window.innerWidth * 0.0019, window.innerHeight * 0.0012);
        this.btnOutlook.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.btnOmitir = this.add.image(this.cameras.main.width * 0.52, window.innerHeight * 0.8, 'btnOmitir').setInteractive();
        this.btnOmitir.setScale(window.innerWidth * 0.0018, window.innerHeight * 0.0012);
        this.btnOmitir.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        
        this.btnOmitir.on('pointerdown', () => {
            this.scene.start("Opcion", {
                demo: false,
                nivel: 1,
                id: false,
            });
        });

        this.btnGoogle.on('pointerdown', () => {
            this.loginGoogle(auth, provider, db); 
        });
        
        this.btnOutlook.on('pointerdown', () => {
            this.loginOutlook(auth, providerOutlook, db)
        });
        
        this.btnEntrar.on('pointerover', () => {
            // this.btnEntrar.setFrame(1);
        }).on('pointerout', () => {
            // this.btnEntrar.setFrame(0);
        }).on('pointerdown', () => {   
            let email = $('#inputEmail').val();
            let clave = $('#inputClave').val();
            if (email && clave) {
                this.loginTraducuinal(auth, email, clave, db);
            } else {
                let textoValidacion = '';
                if (!email) {
                    textoValidacion = textoValidacion + 'Por favor ingrese su usuario.\n';
                }
                if (!clave) {
                    textoValidacion = textoValidacion + 'Por favor ingrese su contraseña.';
                }
                alert(textoValidacion);
            }
        });
        
        this.btnRegistrarse.on('pointerdown', () => {      
            this.scene.start("Registro");
        });
    }

    async loginGoogle(auth, provider, db) {
        signInWithPopup(auth, provider)
        .then((result) => {
            let credential = GoogleAuthProvider.credentialFromResult(result);
            let token = credential.accessToken;
            let user = result.user;
            this.consultarUsuario(db, user.email).then((info) => {
                if (info['id']) {
                    this.scene.start("Opcion", {
                        demo: info['demo'],
                        nivel: info['nivel'],
                        id: info['id'],
                    });
                } else {
                    this.scene.start("Registro", {
                        'email': user.email,
                        'nombre': user.displayName
                    });
                }
            });
        }).catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            let email = error.customData.email;
            let credential = GoogleAuthProvider.credentialFromError(error);
        });
    }

    async loginTraducuinal(auth, email, password, db){
        let info = await this.consultarUsuario(db, email);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                let user = userCredential.user;
                this.scene.start("Opcion", {
                    demo: info['demo'],
                    nivel: info['nivel'],
                    id: info['id'],
                });
            })
            .catch((error) => {
                console.log('Error de inicio de seccion');
                let errorCode = error.code;
                let errorMessage = error.message;
            });
    }

    async loginOutlook(auth, providerOutlook, db) {
        signInWithPopup(auth, providerOutlook)
                .then((result) => {
                    let credential = OAuthProvider.credentialFromResult(result);
                    let accessToken = credential.accessToken;
                    let idToken = credential.idToken;
                    let user = result.user;
                    console.log(result.user);
                    this.consultarUsuario(db, user.email).then((info) => {
                        if (info['id']) {
                            this.scene.start("Opcion", {
                                demo: info['demo'],
                                nivel: info['nivel'],
                                id: info['id'],
                            });
                        } else {
                            this.scene.start("Registro", {
                                'email': user.email,
                                'nombre': user.displayName
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.log('Error outlook');
                });
    }

    async consultarUsuario(db, email) {
        let usuarios = collection(db, "usuarios");
        let datos = query(usuarios, where("email", "==", email));
        let querySnapshot = await getDocs(datos);
        let info = [];
        querySnapshot.forEach((doc) => {
            info['demo'] = doc.data().demo ?? false;
            info['nivel'] = doc.data().nivel ?? 1;
            info['id'] = doc.id;
        });
        return info;
    }

    validarAutenticacion(auth, db){
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user);
                this.consultarUsuario(db, user.email).then((info) => {
                    if (info['id']) {
                        this.scene.start("Opcion", {
                            demo: info['demo'],
                            nivel: info['nivel'],
                            id: info['id'],
                        });
                    }
                });
            }
          });
    }
  }
  
  export default Home;