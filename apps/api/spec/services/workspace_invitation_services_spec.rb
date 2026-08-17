require "rails_helper"

RSpec.describe "Workspace invitation services" do
  let(:owner) do
    User.create!(
      supabase_user_id: "11111111-1111-4111-8111-111111111111",
      email: "owner@example.com",
      display_name: "Owner"
    )
  end
  let(:workspace) do
    Workspace.create!(
      name: "Signal Service",
      slug: "signal-service-invitations",
      public_form_token: SecureRandom.urlsafe_base64(18)
    )
  end

  before do
    Membership.create!(workspace:, user: owner, role: :owner)
  end

  it "removes the invitation when email delivery fails" do
    message = instance_double(ActionMailer::MessageDelivery)
    parameterized_mailer = double("ParameterizedMailer", invite: message)
    allow(WorkspaceInvitationMailer).to receive(:with).and_return(parameterized_mailer)
    allow(message).to receive(:deliver_now!).and_raise(StandardError, "provider unavailable")

    expect do
      InviteWorkspaceMember.new(
        workspace:,
        invited_by: owner,
        email: "new@example.com",
        role: "member"
      ).call
    end.to raise_error(InviteWorkspaceMember::DeliveryError)

    expect(WorkspaceInvitation.where(email: "new@example.com")).to be_empty
  end

  it "stores only a digest of the invitation token" do
    invitation = InviteWorkspaceMember.new(
      workspace:,
      invited_by: owner,
      email: "new@example.com",
      role: "member"
    ).call

    expect(invitation.token_digest).to match(/\A[0-9a-f]{64}\z/)
    expect(invitation.attributes.keys).not_to include("token")
  end
end
