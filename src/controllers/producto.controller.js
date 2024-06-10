import productosModel from '../models/productos.model.js';
import * as fs from 'fs';

// Obtener productos
export const getProductos = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('getProductos called with id:', id);
        const rows = (id === undefined) ? await productosModel.find() : await productosModel.findById(id);
        return res.status(200).json({ status: true, data: rows });
    } catch (error) {
        console.log('Error in getProductos:', error);
        return res.status(500).json({ status: false, errors: [error.message] });
    }
};

// Validar producto
const validar = (nombre, descripcion, precio, cantidad, imagen, tipo, marca, sevalida) => {
    let errors = [];
    if (nombre === undefined || nombre.trim() === '') {
        errors.push('El nombre no debe estar vacío');
    }
    if (descripcion === undefined || descripcion.trim() === '') {
        errors.push('La descripción no debe estar vacía');
    }
    if (precio === undefined || precio.trim() === '' || isNaN(precio)) {
        errors.push('El precio no debe estar vacío o no es un número');
    }
    if (cantidad === undefined || cantidad.trim() === '' || isNaN(cantidad)) {
        errors.push('La cantidad no debe estar vacía o no es un número');
    }
    if (tipo === undefined || (typeof tipo === 'string' && tipo.trim() === '')) {
        errors.push('El tipo no debe estar vacío');
    }
    if (marca === undefined || (typeof marca === 'string' && marca.trim() === '')) {
        errors.push('La marca no debe estar vacía');
    }
    if (sevalida === 'Y' && imagen === undefined) {
        errors.push('La imagen debe ser jpg o png');
    } else {
        if (errors.length > 0 && imagen) {
            fs.unlinkSync('./public/uploads/' + imagen.filename);
        }
    }
    return errors;
};

// Crear producto
export const createProducto = async (req, res) => {
    console.log('createProducto called with:', req.body, req.file);
    try {
        const { nombre, descripcion, precio, cantidad, tipo, marca } = req.body;
        const validacion = validar(nombre, descripcion, precio, cantidad, req.file, tipo, marca, 'Y');
        if (validacion.length === 0) {
            const newProducto = new productosModel({
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                cantidad: cantidad,
                tipo: tipo,
                marca: marca,
                imagen: '/uploads/' + req.file.filename,
                user: req.user.id,
            });
            await newProducto.save();
            return res.status(200).json({ status: true, message: 'Producto creado' });
        } else {
            return res.status(400).json({ status: false, errors: validacion });
        }
    } catch (error) {
        console.log('Error in createProducto:', error);
        return res.status(500).json({ status: false, errors: [error.message] });
    }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
    try {
        console.log('deleteProducto called with id:', req.params.id);
        const producto = await productosModel.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ status: false, message: "Producto no encontrado" });
        return res.status(200).json({ status: true, message: "Producto eliminado correctamente" });
    } catch (error) {
        console.log('Error in deleteProducto:', error);
        return res.status(500).json({ status: false, message: "Error al eliminar el producto" });
    }
};

// Actualizar producto
export const updateProducto = async (req, res) => {
    try {
        console.log('updateProducto called with id:', req.params.id, 'and body:', req.body);
        const { id } = req.params;
        const { nombre, descripcion, precio, cantidad, tipo, marca } = req.body;
        let imagen = '';
        let valores = { nombre: nombre, descripcion: descripcion, precio: precio, cantidad: cantidad, tipo: tipo, marca: marca };
        if (req.file != null) {
            imagen = '/uploads/' + req.file.filename;
            valores = { nombre: nombre, descripcion: descripcion, precio: precio, cantidad: cantidad, imagen: imagen, tipo: tipo, marca: marca };
        }
        const validacion = validar(nombre, descripcion, precio, cantidad, req.file, tipo, marca, 'Y');
        if (validacion.length === 0) {
            await productosModel.updateOne({ _id: id }, { $set: valores });
            return res.status(200).json({ status: true, message: 'Producto actualizado' });
        } else {
            return res.status(400).json({ status: false, errors: validacion });
        }
    } catch (error) {
        console.log('Error in updateProducto:', error);
        return res.status(500).json({ status: false, errors: [error.message] });
    }
};

// Obtener productos por tipo
export const getProductosPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        console.log('getProductosPorTipo called with tipo:', tipo);
        const rows = await productosModel.find({ tipo: tipo });
        return res.status(200).json({ status: true, data: rows });
    } catch (error) {
        console.log('Error in getProductosPorTipo:', error);
        return res.status(500).json({ status: false, errors: [error.message] });
    }
};
