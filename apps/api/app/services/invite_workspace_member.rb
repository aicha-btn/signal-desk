class InviteWorkspaceMember
  class Error < StandardError; end
  class DeliveryError < Error; end

  EXPIRATION = 7.days

  def initialize(workspace:, invited_by:, email:, role:)
    @workspace = workspace
    @invited_by = invited_by
    @email = email.to_s.strip.downcase
    @role = role.to_s
  end

  def call
    ensure_email_delivery!
    raw_token = SecureRandom.urlsafe_base64(32)
    invitation = create_invitation!(raw_token)

    WorkspaceInvitationMailer.with(invitation:, token: raw_token).invite.deliver_now!
    invitation
  rescue StandardError => error
    invitation&.destroy!
    raise error if error.is_a?(Error) || error.is_a?(ActiveRecord::RecordInvalid)

    raise DeliveryError, "The invitation email could not be sent. Try again."
  end

  private

  attr_reader :workspace, :invited_by, :email, :role

  def create_invitation!(raw_token)
    ActiveRecord::Base.transaction do
      workspace.workspace_invitations.where(email:, accepted_at: nil).where(expires_at: ..Time.current).delete_all
      raise Error, "This person already belongs to the workspace." if existing_member?
      enforce_role_boundary!

      workspace.workspace_invitations.create!(
        invited_by:,
        email:,
        role:,
        token_digest: WorkspaceInvitation.digest(raw_token),
        expires_at: EXPIRATION.from_now
      )
    end
  end

  def existing_member?
    workspace.users.where("LOWER(users.email) = ?", email).exists?
  end

  def enforce_role_boundary!
    membership = workspace.memberships.find_by!(user: invited_by)
    return if membership.owner?
    return if membership.admin? && role == "member"

    raise Error, "Admins can only invite members."
  end

  def ensure_email_delivery!
    return unless Rails.env.production? && ENV["RESEND_API_KEY"].blank?

    raise DeliveryError, "Email delivery is not configured yet."
  end
end
