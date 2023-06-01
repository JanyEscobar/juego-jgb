import { Nivel1 } from './niveles/Nivel1.js';
import { Nivel2 } from './niveles/Nivel2.js';
import { Nivel3 } from './niveles/Nivel3.js';
import { Nivel4 } from './niveles/Nivel4.js';
import { Nivel5 } from './niveles/Nivel5.js';

export class Niveles {
    constructor(scene) {
        this.relatedScene = scene;
        this.niveles = [
            // Nivel5,
            // Nivel4,
            // Nivel3,
            // Nivel2,
            Nivel1,
        ];
    }

    create() {
        let CurrenPhaseClass = this.niveles.pop();
        this.currentPhase = new CurrenPhaseClass(this.relatedScene);
        return this.currentPhase.create();
    }

    nextLevel() {
        this.currentPhase.deleteFixedBricks();
        if(this.niveles.length == 0) {
            // this.relatedScene.endGame(true);
        } else {
            return this.create();
        }
    }
}