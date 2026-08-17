class CreateCustomersAndFeedbacks < ActiveRecord::Migration[8.1]
  def change
    create_table :customers do |t|
      t.references :workspace, null: false, foreign_key: true
      t.string :name, null: false
      t.string :company
      t.string :email

      t.timestamps
    end

    add_index :customers, %i[workspace_id name]
    add_index :customers,
      "workspace_id, LOWER(email)",
      unique: true,
      where: "email IS NOT NULL AND email <> ''",
      name: "index_customers_on_workspace_and_lower_email"

    create_table :feedbacks do |t|
      t.references :workspace, null: false, foreign_key: true
      t.references :customer, null: true, foreign_key: true
      t.references :created_by, null: true, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.text :description, null: false
      t.string :status, null: false, default: "new"
      t.string :priority, null: false, default: "medium"
      t.string :source, null: false, default: "internal"

      t.timestamps
    end

    add_index :feedbacks, %i[workspace_id status created_at]
    add_index :feedbacks, %i[workspace_id priority created_at]

    reversible do |direction|
      direction.up do
        execute "ALTER TABLE customers ENABLE ROW LEVEL SECURITY"
        execute "ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY"
      end
    end
  end
end
