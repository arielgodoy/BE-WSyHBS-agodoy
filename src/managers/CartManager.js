//import fs from 'fs';
const fs = require('fs');

class CartsManager {
    constructor(path) {
        this.path = path //
    }

    readFile = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            console.log(data)
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    getCartById = async (cid) => {
        const carts = await this.readFile()
        const cart = carts.find(cart => cart.id === cid)
        if (!cart) {
            return 'No se encuentra el cart'
        }

        return cart
    }

    createCart = async () => {
        const carts = await this.readFile();
        let newCart;

        if (carts.length === 0) {
            newCart = { id: 1, products: [] };
        } else {
            newCart = { id: this.generaIdcompuesto(carts.length), products: [] };
        }

        carts.push(newCart);
        const results = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
        return results;
    };

    addProductToCart = async (cid, pid) => {
        const carts = await this.readFile();
        const cartIndex = carts.findIndex((cart) => cart.id === cid);

        if (cartIndex === -1) {
            return 'No se encuentra el carrito';
        }

        // Buscar el producto en el carrito
        const productIndex = carts[cartIndex].products.findIndex((product) => product.productId === pid);

        if (productIndex !== -1) {
            // Si el producto ya existe, incrementar la cantidad en 1
            carts[cartIndex].products[productIndex].quantity += 1;
        } else {
            // Si el producto no existe, agregarlo con cantidad 1
            carts[cartIndex].products.push({ productId: pid, quantity: 1 });
        }

        const results = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
        return results;
    };



    getCars() {
        return this.carts;
    }

    generaIdcompuesto(largo) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const idCorrelative = largo + 1 ;
        const combinedId = year * 1000000 + month * 10000 + day * 100 + idCorrelative;
        return combinedId;
      }

}

//const carritomanager = new CartsManager('.././data/carts.json');
//carritomanager.createCart();
//module.exports = CartsManager
//export default CartsManager;
module.exports = CartsManager;  