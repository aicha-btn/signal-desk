class Feedback < ApplicationRecord
  STATUSES = %w[new reviewing planned resolved].freeze
  PRIORITIES = %w[low medium high critical].freeze
  SOURCES = %w[internal public_form email support call other].freeze

  belongs_to :workspace
  belongs_to :customer, optional: true
  belongs_to :created_by, class_name: "User", optional: true
  has_many :feedback_tags, dependent: :destroy
  has_many :tags, through: :feedback_tags

  enum :status, STATUSES.index_with(&:itself), prefix: true, validate: true
  enum :priority, PRIORITIES.index_with(&:itself), prefix: true, validate: true
  enum :source, SOURCES.index_with(&:itself), prefix: true, validate: true

  validates :title, presence: true, length: { maximum: 160 }
  validates :description, presence: true, length: { maximum: 10_000 }
  validate :customer_belongs_to_workspace

  private

  def customer_belongs_to_workspace
    return if customer.blank? || customer.workspace_id == workspace_id

    errors.add(:customer, "must belong to the same workspace")
  end
end
