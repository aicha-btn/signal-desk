class CreateEarlyAccessSignups < ActiveRecord::Migration[8.1]
  def change
    create_table :early_access_signups do |t|
      t.string :email, null: false
      t.string :company
      t.string :role
      t.string :team_size
      t.string :source, null: false, default: "landing"
      t.string :status, null: false, default: "new"
      t.datetime :consent_at, null: false

      t.timestamps
    end

    add_index :early_access_signups, "LOWER(email)", unique: true,
      name: "index_early_access_signups_on_lower_email"
  end
end
