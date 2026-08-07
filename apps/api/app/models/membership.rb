class Membership < ApplicationRecord
  ROLES = %w[owner admin member].freeze

  belongs_to :user
  belongs_to :workspace

  enum :role, ROLES.index_with(&:itself), validate: true

  validates :user_id, uniqueness: { scope: :workspace_id }
end
