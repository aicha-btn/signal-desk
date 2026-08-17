class WorkspaceInvitationPolicy < ApplicationPolicy
  def index?
    manager?
  end

  def create?
    manager?
  end

  def show?
    invited_user?
  end

  def accept?
    invited_user?
  end

  def destroy?
    return false unless manager?

    membership.owner? || record.member?
  end

  private

  def workspace
    record.is_a?(Workspace) ? record : record.workspace
  end

  def membership
    @membership ||= workspace.memberships.find_by(user:)
  end

  def manager?
    membership&.owner? || membership&.admin?
  end

  def invited_user?
    user.present? && ActiveSupport::SecurityUtils.secure_compare(user.email.downcase, record.email.downcase)
  end
end
