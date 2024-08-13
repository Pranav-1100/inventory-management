const { Product, Inventory } = require('../models');

class ProductService {
  static async createProduct(productData) {
    const product = await Product.create(productData);
    await Inventory.create({ productId: product.id, quantity: 0 });
    return product;
  }

  static async getAllProducts() {
    return await Product.findAll({ include: Inventory });
  }

  static async getProductById(id) {
    const product = await Product.findByPk(id, { include: Inventory });
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async updateProduct(id, productData) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    return await product.update(productData);
  }

  static async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    await product.destroy();
  }
}

module.exports = ProductService;