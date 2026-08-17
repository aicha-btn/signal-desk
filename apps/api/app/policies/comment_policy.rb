class CommentPolicy < ApplicationPolicy
  def destroy?
    record.author_id == user.id || membership&.owner? || membership&.admin?
  end

  private

  def membership
    @membership ||= record.workspace.memberships.find_by(user:)
  end
end
