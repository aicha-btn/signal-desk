class WorkspaceInvitation < ApplicationRecord
  ROLES = %w[admin member].freeze

  belongs_to :workspace
  belongs_to :invited_by, class_name: "User"

  enum :role, ROLES.index_with(&:itself), validate: true

  validates :email,
    presence: true,
    length: { maximum: 254 },
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :token_digest, presence: true, uniqueness: true
  validates :expires_at, presence: true
  validates :email, uniqueness: {
    scope: :workspace_id,
    case_sensitive: false,
    conditions: -> { where(accepted_at: nil) },
    message: "already has a pending invitation"
  }

  scope :pending, -> { where(accepted_at: nil).where("expires_at > ?", Time.current) }

  before_validation :normalize_email

  def self.digest(token)
    Digest::SHA256.hexdigest(token)
  end

  def self.find_by_token(token)
    find_by(token_digest: digest(token.to_s))
  end

  def pending?
    accepted_at.nil? && expires_at.future?
  end

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end
