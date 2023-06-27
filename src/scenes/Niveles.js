import { Nivel1 } from './niveles/Nivel1.js';
import { Nivel2 } from './niveles/Nivel2.js';
import { Nivel3 } from './niveles/Nivel3.js';
import { Nivel4 } from './niveles/Nivel4.js';
import { Nivel5 } from './niveles/Nivel5.js';
import { Publicidad1 } from "./niveles/Publicidad1.js";
import { Publicidad2 } from "./niveles/Publicidad2.js";
import { Publicidad3 } from './niveles/Publicidad3.js';
import { Publicidad4 } from './niveles/Publicidad4.js';

export class Niveles {
    constructor(scene, nivel) {
        this.relatedScene = scene;
        this.nivelActual = nivel;

        this.niveles = [
            Nivel5,
            Publicidad4,
            Nivel4,
            Publicidad3,
            Nivel3,
            Publicidad2,
            Nivel2,
            Publicidad1,
            Nivel1,
        ];
        if (this.nivelActual != 1 && this.nivelActual < 6) {
            let cantidad = (this.nivelActual * 2) - 2;
            for (let i = 0; i < cantidad; i++) {
                this.niveles.pop();
            }
        }
    }

    create() {
        let CurrenPhaseClass = this.niveles.pop();
        this.currentPhase = new CurrenPhaseClass(this.relatedScene);
        return this.currentPhase.create();
    }

    pillsFalling() {
        let posiciones = [50, 245, 490];
        let posicionesActuales = [];
        if (this.currentPhase.pills) {
            if (this.currentPhase.pills.countActive() < 3) {
                let cantidadSprite = 7;
                this.currentPhase.pills.getChildren().forEach(item => {
                    posicionesActuales.push(item.x);
                });
                let p = posiciones[this.getRandomInt(0, 2)];
                while (posicionesActuales.includes(p)) {
                    p = posiciones[this.getRandomInt(0, 2)];
                }
                if (this.relatedScene.vidas.vidasActuales.countActive() < 2) {
                    cantidadSprite = 8;
                }
                var pill = this.currentPhase.pills.get(p, -68).setCircle(2, 0, 120);
                pill.answer = this.getRandomInt(1, cantidadSprite);
                // pill.setFrame(pill.answer - 1);
                pill.setFrame(3);
            }
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getPill() {
        if (this.currentPhase.pills) {
            return this.currentPhase.pills.clear(true, true);
        }
    }

    update() {
        if (this.currentPhase.pills) {
            this.currentPhase.pills.getChildren().forEach(item => {
                if (item.y > 600) {
                    item.destroy();
                }
            });
        }
    }

    nextLevel(limpiar = true) {
        if(this.niveles.length == 0) {
            this.relatedScene.results();
        } else {
            if (limpiar) {
                this.getPill();
            }
            return this.create();
        }
    }
}