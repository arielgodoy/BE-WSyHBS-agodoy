//import { Router } from 'express';
//import ProductManager from '../managers/ProductManager.js';
const express = require('express');
const ProductManager = require('../managers/ProductManager.js');
const productManager = new ProductManager('./src/data/productos.json');
const router = express.Router();

router
    .get('/', async (req, res) => {
        try {            
            const limit = parseInt(req.query.limit);
            const allProducts = await productManager.getProducts();

            if (!isNaN(limit)) {
                const limitedProducts = allProducts.slice(0, limit);
                res.json(limitedProducts);
            } else {
                res.json(allProducts);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    })

    .get('/:pid', async (req, res) => {
        const id = parseInt(req.params.pid);
        try {            
            const producto = productManager.getProductById(id);
            if (producto) {
                res.json(producto);
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    })

    .put('/:id', (req, res) => {
        const productId = parseInt(req.params.id);

        // Validar si el id está presente y es un número válido
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'ID no válido.' });
        }
        const updatedProductData = req.body;
        productManager.updateProduct(productId, updatedProductData);
        res.json({ message: `Producto con ID ${productId} actualizado con éxito.` });
    })

    .delete('/:id', (req, res) => {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'ID no válido.' });
        }
        //devolvemos respuesta  desde el metodo del deletePorduct ProductManager 
        res.json(productManager.deleteProduct(productId));

    })



    .post('/', (req, res) => {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        productManager.addProduct(title, description, price, thumbnail, code, stock, status, category);
        res.json({ message: 'Producto agregado con éxito.' });
    })


//export default router;
module.exports = router;  

