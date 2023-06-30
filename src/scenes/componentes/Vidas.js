export class Vidas {
    constructor(scene, initialLives) {
        this.relatedScene = scene;
        this.initialLives = initialLives;
    }

    create() {
        this.crearVidas(this.initialLives - 1);
    }

    accionVidas(muerteTotal = false) {
        if (this.vidasActuales.countActive() == 0 || muerteTotal) {
            return true;
        }
        let currentLiveLost = this.vidasActuales.getFirstAlive();
        currentLiveLost.disableBody(true, true);
        return false;
    }

    agregarVida() {
        let cantidad = this.vidasActuales.countActive() + 1;
        this.vidasActuales.clear(true, true);
        this.crearVidas(cantidad);
    }

    crearVidas(cantidad) {
        let displacement = 60;
        let firstPosition = 520 - (cantidad * displacement);
        this.vidasActuales = this.relatedScene.physics.add.staticGroup({
            setScale: { x: 0.5, y: 0.5 },
            key: 'vidas',
            frameQuantity: cantidad,
            gridAlign: {
                width: cantidad,
                height: 1,
                cellWidth: displacement,
                cellHeight: 30,
                x: firstPosition,
                y: 4
            }
        }).setDepth(1);

        this.agregarNombreVida();
    }

    agregarNombreVida(eliminar = false){
        if (eliminar) {
            this.eliminarNombreVida();
        }
        let cantidadVidas = this.vidasActuales.countActive();
        // Asigna texto a cada elemento del grupo
        this.vidasActuales.getChildren().forEach(function(element, index) {
            if (element.active) {
                element.texto = this.add.text(element.x - 10, element.y - 10, `B${cantidadVidas}`, { fontFamily: 'Arial', fontSize: '16px', color: "#FFFFFF", fontStyle: 'normal' }).setDepth(10);
                cantidadVidas--;
            }
        }, this.relatedScene);
    }

    eliminarNombreVida(){
        // Eliminar texto a cada elemento del grupo
        this.vidasActuales.getChildren().forEach(function(element, index) {
            if (element.texto) {
                element.texto.destroy();
                delete element.texto;
            }
        }, this.relatedScene);
    }
}