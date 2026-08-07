class EnableRowLevelSecurityForBusinessTables < ActiveRecord::Migration[8.1]
  TABLES = %w[early_access_signups users workspaces memberships].freeze

  def up
    TABLES.each do |table|
      execute "ALTER TABLE #{quote_table_name(table)} ENABLE ROW LEVEL SECURITY"
    end
  end

  def down
    TABLES.each do |table|
      execute "ALTER TABLE #{quote_table_name(table)} DISABLE ROW LEVEL SECURITY"
    end
  end
end
