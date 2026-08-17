class FeedbackTag < ApplicationRecord
  belongs_to :feedback
  belongs_to :tag

  validates :tag_id, uniqueness: { scope: :feedback_id }
  validate :records_belong_to_same_workspace

  private

  def records_belong_to_same_workspace
    return if feedback.blank? || tag.blank? || feedback.workspace_id == tag.workspace_id

    errors.add(:tag, "must belong to the same workspace")
  end
end
