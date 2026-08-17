class CreateCommentsAndActivityEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :comments do |t|
      t.references :workspace, null: false, foreign_key: true
      t.references :feedback, null: false, foreign_key: true
      t.references :author, null: false, foreign_key: { to_table: :users }
      t.text :body, null: false

      t.timestamps
    end

    add_index :comments, %i[feedback_id created_at]

    create_table :activity_events do |t|
      t.references :workspace, null: false, foreign_key: true
      t.references :feedback, null: true, foreign_key: true
      t.references :actor, null: true, foreign_key: { to_table: :users }
      t.string :action, null: false
      t.jsonb :metadata, null: false, default: {}

      t.timestamps
    end

    add_index :activity_events, %i[workspace_id created_at]
    add_index :activity_events, %i[feedback_id created_at]

    reversible do |direction|
      direction.up do
        execute "ALTER TABLE comments ENABLE ROW LEVEL SECURITY"
        execute "ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY"
      end
    end
  end
end
