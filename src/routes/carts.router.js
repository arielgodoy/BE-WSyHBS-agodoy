//import { Router } from 'express';
const express = require('express');
//const CartsManager = require('../managers/CartManager.js');
//import CartsManager from '../managers/CartManager.js';
const CartsManager = require('../managers/CartManager.js');

const cartsService = new CartsManager('./src/data/carts.json');
const router = express.Router();


const middle_ware = (req,res,next)=>{
  req.user='Esteseriaelusuario';
  console.log(req.user);
  next();
}

 router

  // agregamos el midel_ware de prueba
  .get('/',middle_ware, async (req, res) => {
    try {
      await cartsService.readFile();
      const allcarts = await cartsService.getCars();
      res.send({
        status: 'success',
        payload: allcarts
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  })

  .post('/', async (req, res) => {
    try {
      const result = await cartsService.createCart();
      res.send({
        status: 'success',
        payload: result
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 'error',
        message: 'Error interno del servidor'
      });
    }
  })



  .get('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartsService.getCartById(parseInt(cid));
      if (typeof cart === 'string') {
        res.status(404).send({
          status: 'error',
          message: cart
        });
      } else {
        res.send({
          status: 'success',
          payload: cart
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 'error',
        message: 'Error interno del servidor'
      });
    }
  })

  
  .post('/:cid/product/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const result = await cartsService.addProductToCart(parseInt(cid), parseInt(pid));
      if (typeof result === 'string') {
        res.status(404).send({
          status: 'error',
          message: result
        });
      } else {
        res.send({
          status: 'success',
          payload: result
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 'error',
        message: 'Error interno del servidor'
      });
    }
  });


//export { router as default }; 
module.exports = router;  
