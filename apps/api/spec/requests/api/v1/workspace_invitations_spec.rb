require "rails_helper"

RSpec.describe "Workspace invitations", type: :request do
  let(:workspace) do
    Workspace.create!(
      name: "Signal Studio",
      slug: "signal-studio-invitations",
      public_form_token: SecureRandom.urlsafe_base64(18)
    )
  end
  let(:owner) { create_user("owner", "owner@example.com", "Owner") }
  let(:admin) { create_user("admin", "admin@example.com", "Admin") }
  let(:member) { create_user("member", "member@example.com", "Member") }
  let(:guest) { create_user("guest", "guest@example.com", "Guest") }

  before do
    Membership.create!(workspace:, user: owner, role: :owner)
    Membership.create!(workspace:, user: admin, role: :admin)
    Membership.create!(workspace:, user: member, role: :member)
    ActionMailer::Base.deliveries.clear
    allow(SupabaseJwtVerifier).to receive(:verify) do |token|
      {
        "owner-token" => claims_for(owner),
        "admin-token" => claims_for(admin),
        "member-token" => claims_for(member),
        "guest-token" => claims_for(guest)
      }.fetch(token)
    end
  end

  it "lets an owner invite an admin and sends the private link by email" do
    expect do
      post "/api/v1/workspaces/#{workspace.id}/invitations",
        params: { email: " New.Admin@Example.com ", role: "admin" },
        headers: authorization_header("owner-token")
    end.to change(WorkspaceInvitation, :count).by(1).and change(ActionMailer::Base.deliveries, :count).by(1)

    expect(response).to have_http_status(:created)
    expect(response.parsed_body.dig("invitation", "email")).to eq("new.admin@example.com")
    expect(response.parsed_body.dig("invitation", "role")).to eq("admin")
    expect(response.body).not_to include("token")
    expect(ActionMailer::Base.deliveries.last.body.encoded).to include("/invitations/")
  end

  it "lets an admin invite members but not other admins" do
    post "/api/v1/workspaces/#{workspace.id}/invitations",
      params: { email: "new-member@example.com", role: "member" },
      headers: authorization_header("admin-token")
    expect(response).to have_http_status(:created)

    post "/api/v1/workspaces/#{workspace.id}/invitations",
      params: { email: "new-admin@example.com", role: "admin" },
      headers: authorization_header("admin-token")
    expect(response).to have_http_status(:unprocessable_content)
    expect(response.parsed_body.dig("error", "message")).to eq("Admins can only invite members.")
  end

  it "forbids members from listing or creating invitations" do
    get "/api/v1/workspaces/#{workspace.id}/invitations", headers: authorization_header("member-token")
    expect(response).to have_http_status(:forbidden)

    post "/api/v1/workspaces/#{workspace.id}/invitations",
      params: { email: "outside@example.com", role: "member" },
      headers: authorization_header("member-token")
    expect(response).to have_http_status(:forbidden)
  end

  it "rejects duplicate invitations and existing workspace members" do
    create_invitation(email: "pending@example.com")

    post "/api/v1/workspaces/#{workspace.id}/invitations",
      params: { email: "pending@example.com", role: "member" },
      headers: authorization_header("owner-token")
    expect(response).to have_http_status(:unprocessable_content)

    post "/api/v1/workspaces/#{workspace.id}/invitations",
      params: { email: member.email, role: "member" },
      headers: authorization_header("owner-token")
    expect(response).to have_http_status(:unprocessable_content)
    expect(response.parsed_body.dig("error", "message")).to eq("This person already belongs to the workspace.")
  end

  it "allows an owner to cancel any invitation but protects admin invitations from admins" do
    admin_invitation = create_invitation(email: "second-admin@example.com", role: :admin)

    delete "/api/v1/workspaces/#{workspace.id}/invitations/#{admin_invitation.id}", headers: authorization_header("admin-token")
    expect(response).to have_http_status(:forbidden)

    delete "/api/v1/workspaces/#{workspace.id}/invitations/#{admin_invitation.id}", headers: authorization_header("owner-token")
    expect(response).to have_http_status(:no_content)
    expect(WorkspaceInvitation.exists?(admin_invitation.id)).to be(false)
  end

  it "reveals and accepts a valid invitation only for its email address" do
    raw_token = SecureRandom.urlsafe_base64(32)
    invitation = create_invitation(email: guest.email, raw_token:)

    get "/api/v1/invitations/#{raw_token}", headers: authorization_header("member-token")
    expect(response).to have_http_status(:forbidden)

    get "/api/v1/invitations/#{raw_token}", headers: authorization_header("guest-token")
    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("invitation", "workspace", "name")).to eq("Signal Studio")

    expect do
      post "/api/v1/invitations/#{raw_token}/accept", headers: authorization_header("guest-token")
    end.to change(Membership, :count).by(1)

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("membership", "role")).to eq("member")
    expect(invitation.reload.accepted_at).to be_present
  end

  it "rejects expired and already accepted invitations" do
    expired_token = SecureRandom.urlsafe_base64(32)
    create_invitation(email: guest.email, raw_token: expired_token, expires_at: 1.minute.ago)

    post "/api/v1/invitations/#{expired_token}/accept", headers: authorization_header("guest-token")
    expect(response).to have_http_status(:unprocessable_content)
    expect(response.parsed_body.dig("error", "message")).to eq("This invitation has expired.")
    WorkspaceInvitation.find_by_token(expired_token).destroy!

    accepted_token = SecureRandom.urlsafe_base64(32)
    create_invitation(email: guest.email, raw_token: accepted_token, accepted_at: 1.minute.ago)
    post "/api/v1/invitations/#{accepted_token}/accept", headers: authorization_header("guest-token")
    expect(response).to have_http_status(:unprocessable_content)
    expect(response.parsed_body.dig("error", "message")).to eq("This invitation has already been accepted.")
  end

  private

  def create_user(id, email, display_name)
    suffix = Digest::MD5.hexdigest(id)[0, 12]
    User.create!(supabase_user_id: "00000000-0000-4000-8000-#{suffix}", email:, display_name:)
  end

  def claims_for(user)
    { "sub" => user.supabase_user_id, "email" => user.email, "user_metadata" => { "display_name" => user.display_name } }
  end

  def authorization_header(token)
    { "Authorization" => "Bearer #{token}" }
  end

  def create_invitation(email:, role: :member, raw_token: SecureRandom.urlsafe_base64(32), expires_at: 1.day.from_now, accepted_at: nil)
    WorkspaceInvitation.create!(
      workspace:,
      invited_by: owner,
      email:,
      role:,
      token_digest: WorkspaceInvitation.digest(raw_token),
      expires_at:,
      accepted_at:
    )
  end
end
