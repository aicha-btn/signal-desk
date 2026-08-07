require "rails_helper"

RSpec.describe "Authenticated workspace flow", type: :request do
  let(:claims) do
    {
      "sub" => "11111111-1111-4111-8111-111111111111",
      "email" => "aicha@example.com",
      "user_metadata" => { "display_name" => "Aicha" }
    }
  end

  before do
    allow(SupabaseJwtVerifier).to receive(:verify).with("valid-token").and_return(claims)
  end

  it "rejects requests without a bearer token" do
    get "/api/v1/me"

    expect(response).to have_http_status(:unauthorized)
    expect(response.parsed_body.dig("error", "code")).to eq("unauthorized")
  end

  it "synchronizes the Rails user from Supabase claims" do
    expect do
      get "/api/v1/me", headers: authorization_header
    end.to change(User, :count).by(1)

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body).to include("onboarding_required" => true)
    expect(response.parsed_body.dig("user", "email")).to eq("aicha@example.com")
  end

  it "creates the first workspace and owner membership once" do
    expect do
      post "/api/v1/onboarding",
        params: { display_name: "Aicha", workspace_name: "Signal Studio" },
        headers: authorization_header
    end.to change(Workspace, :count).by(1).and change(Membership, :count).by(1)

    expect(response).to have_http_status(:created)
    expect(response.parsed_body.dig("workspace", "role")).to eq("owner")
    expect(response.parsed_body.dig("workspace", "slug")).to eq("signal-studio")

    expect do
      post "/api/v1/onboarding",
        params: { display_name: "Changed", workspace_name: "Another workspace" },
        headers: authorization_header
    end.not_to change(Workspace, :count)
  end

  it "returns validation errors when the workspace name is empty" do
    post "/api/v1/onboarding",
      params: { display_name: "Aicha", workspace_name: "" },
      headers: authorization_header

    expect(response).to have_http_status(:unprocessable_content)
    expect(response.parsed_body.dig("error", "details", "name")).to be_present
  end

  it "isolates workspace collections by membership" do
    user_a = User.sync_from_supabase!(claims)
    user_b = User.create!(
      supabase_user_id: "22222222-2222-4222-8222-222222222222",
      email: "other@example.com"
    )
    workspace_a = create_workspace("Alpha")
    workspace_b = create_workspace("Beta")
    Membership.create!(user: user_a, workspace: workspace_a, role: :owner)
    Membership.create!(user: user_b, workspace: workspace_b, role: :owner)

    get "/api/v1/workspaces", headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.fetch("workspaces").pluck("name")).to eq([ "Alpha" ])
  end

  private

  def authorization_header
    { "Authorization" => "Bearer valid-token" }
  end

  def create_workspace(name)
    Workspace.create!(
      name:,
      slug: name.downcase,
      public_form_token: SecureRandom.urlsafe_base64(18)
    )
  end
end
