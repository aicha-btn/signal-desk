class Customer < ApplicationRecord
  belongs_to :workspace
  has_many :feedbacks, dependent: :nullify

  before_validation :normalize_email

  validates :name, presence: true, length: { maximum: 100 }
  validates :company, length: { maximum: 100 }, allow_blank: true
  validates :email,
    length: { maximum: 254 },
    format: { with: URI::MailTo::EMAIL_REGEXP },
    uniqueness: { scope: :workspace_id, case_sensitive: false },
    allow_blank: true

  private

  def normalize_email
    self.email = email.to_s.strip.downcase.presence
  end
end
