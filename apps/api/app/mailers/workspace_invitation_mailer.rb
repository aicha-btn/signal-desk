class WorkspaceInvitationMailer < ApplicationMailer
  layout false

  def invite
    @invitation = params.fetch(:invitation)
    @accept_url = "#{ENV.fetch('APP_URL', 'http://localhost:3000')}/invitations/#{params.fetch(:token)}"

    mail(
      to: @invitation.email,
      subject: "#{@invitation.invited_by.display_name.presence || @invitation.invited_by.email} invited you to #{@invitation.workspace.name}"
    )
  end
end
