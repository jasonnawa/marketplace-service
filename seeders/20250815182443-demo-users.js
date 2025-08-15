'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        firstname: 'Admin',
        lastname: 'One',
        email: 'admin@example.com',
        password: '$2b$10$fhreK5c3nP0KDlJ/hm7tPu3vtzYbZHJvaglvJodkSENJBQWw5BuPC',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com',
        password: '$2b$10$fhreK5c3nP0KDlJ/hm7tPu3vtzYbZHJvaglvJodkSENJBQWw5BuPC',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
