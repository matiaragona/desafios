const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '[]');
    }
  }

  async getProducts() {
    let archivo = await fs.promises.readFile(this.path, "utf-8");
    console.log(archivo);
  }

  async saveProducts(pr) {
    let archivo = await fs.promises.readFile(this.path, "utf-8");
    let archivoReal = JSON.parse(archivo);
    archivoReal.push(pr);

    await fs.promises.writeFile(this.path, JSON.stringify(archivoReal), "utf-8");
    return "archivo Guardado";
  }
}


let productManager = new ProductManager('./products.json');

productManager.saveProducts({id: 1, name: 'televisor 1'});
productManager.saveProducts({id: 2, name: 'televisor 2'});
productManager.saveProducts({id: 3, name: 'televisor 3'});


module.exports = ProductManager;
