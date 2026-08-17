class Tag < ApplicationRecord
  belongs_to :workspace

  has_many :feedback_tags, dependent: :destroy
  has_many :feedbacks, through: :feedback_tags

  before_validation :normalize_name

  validates :name,
    presence: true,
    length: { maximum: 40 },
    uniqueness: { scope: :workspace_id, case_sensitive: false }

  private

  def normalize_name
    self.name = name.to_s.strip
  end
end
