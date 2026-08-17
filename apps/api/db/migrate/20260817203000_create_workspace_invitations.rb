class CreateWorkspaceInvitations < ActiveRecord::Migration[8.1]
  def change
    create_table :workspace_invitations do |t|
      t.references :workspace, null: false, foreign_key: true
      t.references :invited_by, null: false, foreign_key: { to_table: :users }
      t.string :email, null: false
      t.string :role, null: false, default: "member"
      t.string :token_digest, null: false
      t.datetime :expires_at, null: false
      t.datetime :accepted_at

      t.timestamps
    end

    add_index :workspace_invitations, :token_digest, unique: true
    add_index :workspace_invitations,
      "workspace_id, LOWER(email)",
      unique: true,
      where: "accepted_at IS NULL",
      name: "index_pending_workspace_invitations_on_email"

    execute "ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY"
  end
end
