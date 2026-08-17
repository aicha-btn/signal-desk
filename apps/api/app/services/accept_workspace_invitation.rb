class AcceptWorkspaceInvitation
  class Error < StandardError; end

  def initialize(invitation:, user:)
    @invitation = invitation
    @user = user
  end

  def call
    raise Error, "This invitation has already been accepted." if invitation.accepted_at.present?
    raise Error, "This invitation has expired." if invitation.expires_at.past?
    raise Error, "Sign in with the email address that received this invitation." unless invited_user?

    ActiveRecord::Base.transaction do
      membership = Membership.find_or_create_by!(workspace: invitation.workspace, user:) do |record|
        record.role = invitation.role
      end
      invitation.update!(accepted_at: Time.current)
      membership
    end
  end

  private

  attr_reader :invitation, :user

  def invited_user?
    ActiveSupport::SecurityUtils.secure_compare(user.email.downcase, invitation.email.downcase)
  end
end
