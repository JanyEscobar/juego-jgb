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
        this.load.image('bghome', 'assets/home1.png');
        this.load.image('vector', 'assets/vector.png');
        this.load.image('logo', 'assets/logo_TR.png');
        this.load.image('bienvenida', 'assets/bienvenidos.png');
        this.load.image('iniciarSesion', 'assets/iniciar_sesion.png');
        this.load.image('registrate', 'assets/registrate.png');
        this.load.image('google', 'assets/google.png');
        this.load.image('outlook', 'assets/outlook.png');
        this.load.image('btnRegistrarse', 'assets/btnRegistrar.png');
        this.load.image('powered', 'assets/powered.png');

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

        this.validarAutenticacion(auth, db);
        
        this.background = this.add.image(270, 500, 'bghome');
        this.background.setScale(1, 1.25);
      //  this.background.setScale(1, this.game.scale.height * 0.0014);
        this.logo = this.add.image(270, 150, 'logo');
        this.logo.setScale(2, 2);
        this.bienvenida = this.add.image(270, 330, 'bienvenida');
        this.iniciarSesion = this.add.image(270, 370, 'iniciarSesion');
        this.vector = this.add.image(278, 490, 'vector');
        this.registrate = this.add.image(270, 430, 'registrate');
        this.powered = this.add.image(270, 1084, 'powered');
        let inputEmail = this.add.rexInputText(250, 640, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Usuario',
            id: 'inputEmail',
        });
        let inputClave = this.add.rexInputText(250, 710, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Clave',
            type: 'password',
            id: 'inputClave',
        });
         
        this.btnEntrar = this.add.sprite(270, 820, 'btnEntrar').setDepth(1).setInteractive();
        this.btnRegistrarse = this.add.image(450, 490, 'btnRegistrarse').setDepth(1).setInteractive();
        this.btnGoogle = this.add.image(200, 475, 'google').setInteractive();
        this.btnOutlook = this.add.image(200, 520, 'outlook').setInteractive();
        
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
                    textoValidacion = textoValidacion + 'Por favor ingrese su contrase単a.';
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
            console.log(user);
            this.consultarUsuario(db, user.email).then((info) => {
                if (info['id']) {
                    this.scene.start("Homescene", {
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
                this.scene.start("Homescene", {
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
                            this.scene.start("Homescene", {
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
                        this.scene.start("Homescene", {
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