class User < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :workspaces, through: :memberships
  has_many :created_feedbacks, class_name: "Feedback", foreign_key: :created_by_id, dependent: :nullify

  validates :supabase_user_id, presence: true, uniqueness: true
  validates :email,
    presence: true,
    length: { maximum: 254 },
    format: { with: URI::MailTo::EMAIL_REGEXP },
    uniqueness: { case_sensitive: false }
  validates :display_name, length: { maximum: 80 }, allow_blank: true

  def self.sync_from_supabase!(claims)
    user = find_or_initialize_by(supabase_user_id: claims.fetch("sub"))
    user.email = claims.fetch("email").to_s.strip.downcase
    user.display_name ||= claims.dig("user_metadata", "display_name").to_s.strip.presence
    user.save!
    user
  end
end
