import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, OAuthProvider } from "../../node_modules/firebase/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "../../node_modules/firebase/firebase-firestore.js";

const provider = new GoogleAuthProvider();
const providerOutlook = new OAuthProvider('microsoft.com');

class Home extends Phaser.Scene {
    constructor(){
      super("Home");
    }
  
    preload(){
        this.load.image('bghome', 'assets/jgb/home.png');
        this.load.image('logo', 'assets/jgb/logo_TR.png');
        this.load.image('titulo', 'assets/jgb/bienvenida.png');
        this.load.image('google', 'assets/jgb/google.png');
        this.load.image('outlook', 'assets/jgb/outlook.png');
        this.load.image('powered', 'assets/jgb/powered.png');
    
        this.load.spritesheet('btnEntrar', 'assets/jgb/boton_entrada.png', { frameWidth: 364, frameHeight: 94 });
        this.load.spritesheet('btnRegistrarse', 'assets/jgb/boton_registrarse.png', { frameWidth: 364, frameHeight: 94 });
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
        
        this.background = this.add.image(270, 380, 'bghome');
        this.logo = this.add.image(270, 105, 'logo');
        this.titulo = this.add.image(270, 240, 'titulo');
        let inputEmail = this.add.rexInputText(240, 310, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Usuario',
            id: 'inputEmail',
        });
        let inputClave = this.add.rexInputText(240, 380, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Clave',
            type: 'password',
            id: 'inputClave',
        });
         
        this.btnEntrar = this.add.sprite(270, 480, 'btnEntrar').setInteractive();
        this.btnRegistrarse = this.add.sprite(270, 640, 'btnRegistrarse').setInteractive();
        this.btnGoogle = this.add.sprite(170, 570, 'google').setInteractive();
        this.btnOutlook = this.add.sprite(330, 570, 'outlook').setInteractive();
        this.powered = this.add.sprite(270, 763, 'powered').setInteractive();
        
        this.btnGoogle.on('pointerdown', () => {
            this.loginGoogle(auth, provider, db);
        });
        
        this.btnOutlook.on('pointerdown', () => {
            this.loginOutlook(auth, providerOutlook, db)
        });
        
        this.btnEntrar.on('pointerover', () => {
            this.btnEntrar.setFrame(1);
        }).on('pointerout', () => {
            this.btnEntrar.setFrame(0);
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
        
        this.btnRegistrarse.on('pointerover', () => {
            this.btnRegistrarse.setFrame(1);
        }).on('pointerout', () => {
            this.btnRegistrarse.setFrame(0);
        }).on('pointerdown', () => {      
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
                    // Handle error.
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
  }
  
  export default Home;