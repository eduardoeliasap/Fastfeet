module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('orders', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    recipient_id: {
      type: Sequelize.INTEGER,
      references: { model: 'recipients', key: 'id' }, // Relacionamento com o id da tabela recipent
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    },
    deliveryman_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    signature_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    product: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    canceled_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('orders'),
};
