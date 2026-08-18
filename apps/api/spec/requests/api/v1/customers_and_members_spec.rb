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

  it "shows, updates and deletes a customer without deleting attached Signals" do
    customer = Customer.create!(workspace:, name: "Maya Chen", company: "Northstar", email: "maya@example.com")
    feedback = Feedback.create!(
      workspace:,
      customer:,
      created_by: user,
      title: "Export needs a customer label",
      description: "The team needs to preserve this Signal after the customer profile is removed."
    )

    get "/api/v1/workspaces/#{workspace.id}/customers/#{customer.id}", headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("customer", "signals_count")).to eq(1)

    patch "/api/v1/workspaces/#{workspace.id}/customers/#{customer.id}",
      params: { name: "Maya Laurent", company: "Northstar Europe", email: " MAYA.NEW@EXAMPLE.COM " },
      headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.fetch("customer")).to include(
      "name" => "Maya Laurent",
      "company" => "Northstar Europe",
      "email" => "maya.new@example.com"
    )

    expect do
      delete "/api/v1/workspaces/#{workspace.id}/customers/#{customer.id}", headers: authorization_header
    end.to change(Customer, :count).by(-1)

    expect(response).to have_http_status(:no_content)
    expect(feedback.reload.customer).to be_nil
  end

  it "does not expose customer records from another workspace" do
    outside_workspace = Workspace.create!(
      name: "Outside",
      slug: "outside-#{SecureRandom.hex(2)}",
      public_form_token: SecureRandom.urlsafe_base64(18)
    )
    customer = Customer.create!(workspace: outside_workspace, name: "Private Customer")

    get "/api/v1/workspaces/#{workspace.id}/customers/#{customer.id}", headers: authorization_header
    expect(response).to have_http_status(:not_found)

    patch "/api/v1/workspaces/#{workspace.id}/customers/#{customer.id}",
      params: { name: "Leaked" },
      headers: authorization_header
    expect(response).to have_http_status(:not_found)

    delete "/api/v1/workspaces/#{workspace.id}/customers/#{customer.id}", headers: authorization_header
    expect(response).to have_http_status(:not_found)
    expect(customer.reload.name).to eq("Private Customer")
  end

  it "allows a member to manage customers in their workspace" do
    workspace.memberships.find_by!(user:).update!(role: :member)
    customer = Customer.create!(workspace:, name: "Member Managed")

    patch "/api/v1/workspaces/#{workspace.id}/customers/#{customer.id}",
      params: { name: "Member Updated" },
      headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(customer.reload.name).to eq("Member Updated")

    delete "/api/v1/workspaces/#{workspace.id}/customers/#{customer.id}", headers: authorization_header

    expect(response).to have_http_status(:no_content)
    expect(Customer.exists?(customer.id)).to be(false)
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
