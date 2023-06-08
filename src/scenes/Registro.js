import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "../../node_modules/firebase/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "../../node_modules/firebase/firebase-firestore.js";
// import { autofill } from '@mapbox/search-js-web';

// autofill({
//     accessToken: 'pk.eyJ1IjoiamFueTEyMDciLCJhIjoiY2xpa2loczh0MGZxYTNtcDZrMXhoYjlyZiJ9.bJ5W0_zC9zsguq1vV3pYqw'
// });

class Registro extends Phaser.Scene {
    constructor(){
      super("Registro");
    }
  
    init(data){
        this.email = data.email ?? false;
        this.nombre = data.nombre ?? '';
    }
  
    preload(){
        this.load.image('bghome', 'assets/jgb/home.png');
        this.load.image('powered', 'assets/jgb/powered.png');
        this.load.spritesheet('btnEntrar', 'assets/jgb/boton_entrada.png', { frameWidth: 364, frameHeight: 94 });
    }
  
    create(){
        this.time = 30;
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
        this.btnEntrar = this.add.sprite(270, 540, 'btnEntrar').setInteractive();
        this.powered = this.add.sprite(270, 763, 'powered').setInteractive();
        let inputNombre = this.add.rexInputText(240, 170, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Nombre',
            id: 'inputNombre',
            text: this.nombre,
        });
        let inputEmail = this.add.rexInputText(240, 240, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Email',
            id: 'inputEmail',
            text: this.email ? this.email : '',
        });
        if (!this.email) {
            let inputClave = this.add.rexInputText(240, 310, 300, 52, {
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontFamily: 'Arial',
                fontSize: '24px',
                placeholder: 'Clave',
                type: 'password',
                id: 'inputClave',
            });
        }
        let inputDogeria = this.add.rexInputText(240, !this.email ? 380 : 310, 300, 52, {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '24px',
            placeholder: 'Drogeria',
            id: 'inputDogeria',
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
        selectElement.id = 'selectRol';
        this.add.dom(240, !this.email ? 450 : 380, selectElement).setOrigin(0.5);
        
        this.btnEntrar.on('pointerover', () => {
            this.btnEntrar.setFrame(1);
        }).on('pointerout', () => {
            this.btnEntrar.setFrame(0);
        }).on('pointerdown', () => {      
            let email = $('#inputEmail').val();
            let clave = $('#inputClave').val();
            let nombre = $('#inputNombre').val();
            let rol = $('#selectRol').val();
            if (email && nombre && rol) {
                if (!this.email) {
                    if (clave) {
                        this.registro(auth, email, clave, nombre, rol, db);
                    } else {
                        alert('Por favor ingrese su contraseña');
                    }
                }
                this.crearUsuario(db, nombre, email, rol);
            } else {
                let textoValidacion = '';
                if (!email) {
                    textoValidacion = textoValidacion + 'Por favor ingrese su usuario.\n';
                }
                if (!nombre) {
                    textoValidacion = textoValidacion + 'Por favor ingrese su nombre.';
                }
                if (!rol) {
                    textoValidacion = textoValidacion + 'Por favor ingrese su rol.';
                }
                alert(textoValidacion);
            }
        });
        this.iniciarMaps();
    }

    registro(auth, email, password, nombre, rol, db) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                let user = userCredential.user;
                console.log(user);
                this.actualizar(auth, nombre);
            })
            .catch((error) => {
                console.log('error');
                let errorCode = error.code;
                let errorMessage = error.message;
            });
    }

    actualizar(auth, nombre) {
        console.log('actializar');
        updateProfile(auth.currentUser, {
            displayName: nombre
          }).then((response) => {
            console.log(response);
          }).catch((error) => {
            console.log(error);
          });
    }

    async crearUsuario(db, nombre, email, rol) {
        try {
            let info = await this.consultarUsuario(db, email);
            if (!info['id']) {
                console.log('crear');
                const docRef = await addDoc(collection(db, "usuarios"), {
                  nombre: nombre,
                  email: email,
                  rol: rol,
                  drogeria: '',
                  nivel: 1,
                  puntos: 0,
                  demo: false,
                });
                console.log("Registrado correctamente ID: ", docRef.id);
                info = await this.consultarUsuario(db, email);
            }
            this.scene.start("Homescene", {
                nivel: info['nivel'],
                demo: info['demo'],
                id: info['id'],
            });
          } catch (e) {
            console.error("Error al intentar registrar el usuario: ", e);
          }
    }

    async consultarUsuario(db, email) {
        let usuarios = collection(db, "usuarios");
        let datos = query(usuarios, where("email", "==", email));
        let querySnapshot = await getDocs(datos);
        let info = [];
        querySnapshot.forEach((doc) => {
            info['nivel'] = doc.data().nivel ?? 1;
            info['demo'] = doc.data().demo ?? false;
            info['id'] = doc.id;
        });
        return info;
    }

    iniciarMaps() {
        $('#inputDogeria').attr('autocomplete', 'address-line1');
    }
  }
  
  export default Registro;