class ActivityEvent < ApplicationRecord
  ACTIONS = %w[
    feedback_created
    feedback_status_changed
    feedback_priority_changed
    comment_created
  ].freeze

  belongs_to :workspace
  belongs_to :feedback, optional: true
  belongs_to :actor, class_name: "User", optional: true

  validates :action, presence: true, inclusion: { in: ACTIONS }
  validate :feedback_belongs_to_workspace

  private

  def feedback_belongs_to_workspace
    return if feedback.blank? || feedback.workspace_id == workspace_id

    errors.add(:feedback, "must belong to the same workspace")
  end
end
