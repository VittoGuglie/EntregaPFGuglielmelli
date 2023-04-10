const fs = require('fs')

class FileManager {
    products = [];
    constructor() { }

    async loadItems() {
        if (fs.existsSync(process.cwd() + '/src/files/products.json')) {
            const data = await fs.promises.readFile(
                process.cwd() + '/src/files/products.json'
            );
            const newProducts = JSON.parse(data);
            
            return newProducts;
        }
        return 'El archivo no existe';
    }

    async saveItems() {
        await fs.promises.writeFile();
    }
}

module.exports = FileManager