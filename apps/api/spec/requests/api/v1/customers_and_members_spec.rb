require "rails_helper"

RSpec.describe "Workspace customers and members", type: :request do
  let(:claims) do
    {
      "sub" => "11111111-1111-4111-8111-111111111111",
      "email" => "aicha@example.com",
      "user_metadata" => { "display_name" => "Aicha" }
    }
  end
  let(:user) { User.sync_from_supabase!(claims) }
  let(:workspace) do
    Workspace.create!(
      name: "Signal Studio",
      slug: "signal-studio",
      public_form_token: SecureRandom.urlsafe_base64(18)
    )
  end

  before do
    allow(SupabaseJwtVerifier).to receive(:verify).with("valid-token").and_return(claims)
    Membership.create!(user:, workspace:, role: :owner)
  end

  it "creates a normalized customer" do
    post "/api/v1/workspaces/#{workspace.id}/customers",
      params: { name: "Maya Chen", company: "Northstar", email: " Maya@Example.com " },
      headers: authorization_header

    expect(response).to have_http_status(:created)
    expect(response.parsed_body.dig("customer", "email")).to eq("maya@example.com")
  end

  it "lists workspace members with explicit roles" do
    get "/api/v1/workspaces/#{workspace.id}/members", headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("members", 0, "role")).to eq("owner")
    expect(response.parsed_body.dig("members", 0, "user", "email")).to eq("aicha@example.com")
  end

  private

  def authorization_header
    { "Authorization" => "Bearer valid-token" }
  end
end
