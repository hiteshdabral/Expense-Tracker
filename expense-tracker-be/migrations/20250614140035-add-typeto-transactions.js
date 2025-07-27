'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transactions', 'type', {
      type: Sequelize.ENUM('income', 'expense'),
      allowNull: false,
      defaultValue: 'expense'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactions', 'type');

    // Drop enum type explicitly if needed (PostgreSQL specific)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_transactions_type";');
  }
};
