'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Wireless Mouse',
        description: 'A smooth and responsive wireless mouse.',
        price: 19.99,
        stock: 50,
        category: 'electronics',
        images: ['https://example.com/images/mouse1.jpg'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bluetooth Headphones',
        description: 'Noise-cancelling over-ear headphones with long battery life.',
        price: 79.99,
        stock: 30,
        category: 'electronics',
        images: ['https://example.com/images/headphones1.jpg'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Coffee Mug',
        description: 'Ceramic coffee mug with a sleek design.',
        price: 9.99,
        stock: 100,
        category: 'home',
        images: Sequelize.literal(`ARRAY[]::VARCHAR[]`),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
