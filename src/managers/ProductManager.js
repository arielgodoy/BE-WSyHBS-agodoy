
import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.readFromFile();
  }

  readFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // El archivo no existe, así que lo creamos
        //console.log('Archivo no encontrado, creando uno nuevo en ' + this.path);
        this.products = [];
        this.writeToFile();
      } else {
        // Otro tipo de error
        //console.error('Error al leer el archivo ' + this.path + ':', error.message);
        this.products = [];
      }
    }
  }
  

  writeToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
  }

  addProduct(title, description, price, thumbnail, code, stock, status, category) {
    // Validamos TODOS los campos antes de continuar... exceprto || !thumbnail
    if (!title || !description || !price  || !code || !stock || !status || !category) {      
      return { success: false, message: `Los Campos title,description,price,code,stock,status, y category son requeridos` };      
    }
    // Validamos que el código de producto no exista antes de continuar...
    if (this.getProductByCode(code)) {      
      return { success: false, message: `El código del producto ya existe, Code=${code}` };
    }
    const product = {
      id: this.generaIdcompuesto(),
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    };

    this.products.push(product);
    this.writeToFile();    
    return { success: true, message: `Producto agregado con éxito. ID asignado = ${product.id} ` };    
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index !== -1) {
      this.products.splice(index, 1);
      this.writeToFile();      
      return { success: true, message: `Producto con ID ${id} eliminado con éxito.` };
    } else {      
      return { success: false, message: `No se encontró un producto con ID ${id}.` };
    }
  }

  updateProduct(id, updatedProduct) {    
    const index = this.products.findIndex((product) => product.id === id);

    if (index !== -1) {
      // Validar que los campos necesarios estén presentes en updatedProduct antes de actualizar excepto thumbnail agregado en pre entrega
      if (
        updatedProduct.title &&
        updatedProduct.description &&
        updatedProduct.price &&
        //updatedProduct.thumbnail &&
        updatedProduct.code &&
        updatedProduct.stock
      ) {
        this.products[index] = {
          id: id,
          title: updatedProduct.title,
          description: updatedProduct.description,
          price: updatedProduct.price,
          thumbnail: updatedProduct.thumbnail,
          code: updatedProduct.code,
          stock: updatedProduct.stock,
        };

        this.writeToFile();        
        return { success: true, message: `Producto con ID ${id} actualizado con éxito.` };
      } else {
        console.log("Todos los campos son requeridos para la actualización.");
        return { success: false, message: `Los Campos title,description,price,code,stock,status, y category son requeridos para la actualización.` };      
      }
    } else {
      
      return { success: false, message: `No se encontró un producto con ID ${id}.`};      
    }
  }

  getProducts() {
    this.readFromFile();    
    return this.products;
  }

  getProductById(id) {
    this.readFromFile();
    return this.products.find((product) => product.id === id);
  }

  getProductByCode(code) {
    this.readFromFile();
    return this.products.some((product) => product.code === code);
  }

  generaIdcompuesto() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const idCorrelative = this.products.length + 1;
    //const combinedId = year * 1000000 + month * 10000 + day * 100 + idCorrelative;
    const combinedId = year  + month  + day  + idCorrelative;
    return combinedId;
  }
}
export default ProductManager;

