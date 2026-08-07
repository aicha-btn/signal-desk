class CreateUsersWorkspacesAndMemberships < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.uuid :supabase_user_id, null: false
      t.string :email, null: false
      t.string :display_name

      t.timestamps
    end

    add_index :users, :supabase_user_id, unique: true
    add_index :users, "LOWER(email)", unique: true, name: "index_users_on_lower_email"

    create_table :workspaces do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.boolean :public_form_enabled, null: false, default: false
      t.string :public_form_token, null: false

      t.timestamps
    end

    add_index :workspaces, :slug, unique: true
    add_index :workspaces, :public_form_token, unique: true

    create_table :memberships do |t|
      t.references :user, null: false, foreign_key: true
      t.references :workspace, null: false, foreign_key: true
      t.string :role, null: false, default: "member"

      t.timestamps
    end

    add_index :memberships, %i[user_id workspace_id], unique: true
  end
end
