import {Router} from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { createProducto, deleteProducto, getProductos, updateProducto,getProductosPorTipo } from '../controllers/producto.controller.js';
import { subirImagen } from '../middlewares/Storage.js';
const router = Router()
// falta el authrequired en los get
router.get('/productos',getProductos);
router.get('/productos/:id',getProductos);
router.get('/productos/tipo/:tipo',authRequired,getProductosPorTipo);
router.post('/productos',subirImagen.single('imagen'),createProducto);
router.put('/productos/:id',authRequired,subirImagen.single('imagen'),updateProducto);
router.delete('/productos/:id',authRequired,deleteProducto);


export default router;