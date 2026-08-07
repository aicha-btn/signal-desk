class WorkspacePolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    membership.present?
  end

  def create?
    user.present?
  end

  def update?
    membership&.owner? || membership&.admin?
  end

  private

  def membership
    @membership ||= record.memberships.find_by(user:)
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.joins(:memberships).where(memberships: { user_id: user.id }).distinct
    end
  end
end
