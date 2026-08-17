class Comment < ApplicationRecord
  belongs_to :workspace
  belongs_to :feedback
  belongs_to :author, class_name: "User"

  validates :body, presence: true, length: { maximum: 5_000 }
  validate :records_belong_to_workspace

  private

  def records_belong_to_workspace
    return if workspace.blank?

    errors.add(:feedback, "must belong to the same workspace") if feedback.present? && feedback.workspace_id != workspace_id
    return if author.blank? || workspace.memberships.exists?(user_id: author_id)

    errors.add(:author, "must belong to the workspace")
  end
end
