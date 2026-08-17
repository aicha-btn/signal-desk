class CreateTagsAndFeedbackTags < ActiveRecord::Migration[8.1]
  def change
    create_table :tags do |t|
      t.references :workspace, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end

    add_index :tags,
      "workspace_id, LOWER(name)",
      unique: true,
      name: "index_tags_on_workspace_and_lower_name"

    create_table :feedback_tags do |t|
      t.references :feedback, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end

    add_index :feedback_tags, %i[feedback_id tag_id], unique: true

    reversible do |direction|
      direction.up do
        execute "ALTER TABLE tags ENABLE ROW LEVEL SECURITY"
        execute "ALTER TABLE feedback_tags ENABLE ROW LEVEL SECURITY"
      end
    end
  end
end
