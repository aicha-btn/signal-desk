require "rails_helper"

RSpec.describe "Workspace feedbacks", type: :request do
  let(:claims) do
    {
      "sub" => "11111111-1111-4111-8111-111111111111",
      "email" => "aicha@example.com",
      "user_metadata" => { "display_name" => "Aicha" }
    }
  end
  let(:user) { User.sync_from_supabase!(claims) }
  let(:workspace) { create_workspace("Signal Studio") }

  before do
    allow(SupabaseJwtVerifier).to receive(:verify).with("valid-token").and_return(claims)
    Membership.find_or_create_by!(user:, workspace:) { |membership| membership.role = :owner }
  end

  it "creates and lists a Signal inside the current workspace" do
    expect do
      post "/api/v1/workspaces/#{workspace.id}/feedbacks",
        params: {
          title: "Customers cannot export reports",
          description: "Three customer calls mentioned the same blocker.",
          priority: "high",
          source: "call"
        },
        headers: authorization_header
    end.to change(Feedback, :count).by(1)

    expect(response).to have_http_status(:created)
    expect(response.parsed_body.dig("feedback", "created_by", "email")).to eq("aicha@example.com")

    get "/api/v1/workspaces/#{workspace.id}/feedbacks", headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.fetch("total")).to eq(1)
    expect(response.parsed_body.dig("feedbacks", 0, "priority")).to eq("high")
  end

  it "rejects a customer from another workspace" do
    other_workspace = create_workspace("Other")
    customer = Customer.create!(workspace: other_workspace, name: "Outside Customer")

    post "/api/v1/workspaces/#{workspace.id}/feedbacks",
      params: {
        title: "Cross workspace Signal",
        description: "This association must never be accepted.",
        customer_id: customer.id
      },
      headers: authorization_header

    expect(response).to have_http_status(:not_found)
  end

  it "shows, updates, detaches a customer and deletes a Signal" do
    customer = Customer.create!(workspace:, name: "Maya Chen", company: "Northstar")
    feedback = Feedback.create!(
      workspace:,
      customer:,
      created_by: user,
      title: "Reports need clearer exports",
      description: "The finance team cannot identify which filters are active.",
      priority: :medium,
      source: :call
    )

    get "/api/v1/workspaces/#{workspace.id}/feedbacks/#{feedback.id}", headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("feedback", "customer", "company")).to eq("Northstar")

    patch "/api/v1/workspaces/#{workspace.id}/feedbacks/#{feedback.id}",
      params: { status: "planned", priority: "high", customer_id: "" },
      headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("feedback", "status")).to eq("planned")
    expect(response.parsed_body.dig("feedback", "priority")).to eq("high")
    expect(response.parsed_body.dig("feedback", "customer")).to be_nil

    expect do
      delete "/api/v1/workspaces/#{workspace.id}/feedbacks/#{feedback.id}", headers: authorization_header
    end.to change(Feedback, :count).by(-1)

    expect(response).to have_http_status(:no_content)
  end

  it "does not expose another workspace" do
    other_workspace = create_workspace("Private")

    get "/api/v1/workspaces/#{other_workspace.id}/feedbacks", headers: authorization_header

    expect(response).to have_http_status(:not_found)
  end

  private

  def authorization_header
    { "Authorization" => "Bearer valid-token" }
  end

  def create_workspace(name)
    Workspace.create!(
      name:,
      slug: "#{name.parameterize}-#{SecureRandom.hex(2)}",
      public_form_token: SecureRandom.urlsafe_base64(18)
    )
  end
end
