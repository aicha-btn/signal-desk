class EarlyAccessSignup < ApplicationRecord
  ROLES = %w[product support leadership founder other].freeze
  TEAM_SIZES = %w[1-10 11-50 51-200 201-1000 1000+].freeze

  before_validation :normalize_email

  validates :email,
    presence: true,
    length: { maximum: 254 },
    format: { with: URI::MailTo::EMAIL_REGEXP },
    uniqueness: { case_sensitive: false }
  validates :company, length: { maximum: 100 }, allow_blank: true
  validates :role, inclusion: { in: ROLES }, allow_blank: true
  validates :team_size, inclusion: { in: TEAM_SIZES }, allow_blank: true
  validates :source, presence: true, length: { maximum: 50 }
  validates :status, presence: true, inclusion: { in: %w[new contacted converted archived] }
  validates :consent_at, presence: true

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end
