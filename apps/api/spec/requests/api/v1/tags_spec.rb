require "rails_helper"

RSpec.describe "Workspace tags", type: :request do
  let(:claims) do
    {
      "sub" => "22222222-2222-4222-8222-222222222222",
      "email" => "tags@example.com",
      "user_metadata" => { "display_name" => "Tag Owner" }
    }
  end
  let(:user) { User.sync_from_supabase!(claims) }
  let(:workspace) { create_workspace("Tag Studio") }

  before do
    allow(SupabaseJwtVerifier).to receive(:verify).with("valid-token").and_return(claims)
    Membership.find_or_create_by!(user:, workspace:) { |membership| membership.role = :owner }
  end

  it "creates, lists, renames and deletes a workspace tag" do
    post "/api/v1/workspaces/#{workspace.id}/tags",
      params: { name: "  Churn risk  " },
      headers: authorization_header

    expect(response).to have_http_status(:created)
    tag_id = response.parsed_body.dig("tag", "id")
    expect(response.parsed_body.dig("tag", "name")).to eq("Churn risk")

    feedback = Feedback.create!(
      workspace:,
      title: "A tagged Signal",
      description: "This record makes the count observable.",
      tags: [ Tag.find(tag_id) ]
    )

    get "/api/v1/workspaces/#{workspace.id}/tags", headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("tags", 0)).to include(
      "id" => tag_id,
      "name" => "Churn risk",
      "feedbacks_count" => 1
    )

    patch "/api/v1/workspaces/#{workspace.id}/tags/#{tag_id}",
      params: { name: "Retention" },
      headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("tag", "name")).to eq("Retention")

    expect do
      delete "/api/v1/workspaces/#{workspace.id}/tags/#{tag_id}", headers: authorization_header
    end.to change(Tag, :count).by(-1)

    expect(response).to have_http_status(:no_content)
    expect(feedback.reload.tags).to be_empty
  end

  it "keeps names unique regardless of case inside one workspace" do
    Tag.create!(workspace:, name: "Billing")

    post "/api/v1/workspaces/#{workspace.id}/tags",
      params: { name: "billing" },
      headers: authorization_header

    expect(response).to have_http_status(:unprocessable_content)
    expect(response.parsed_body.dig("error", "details", "name")).to be_present
  end

  it "does not expose another workspace tag" do
    other_workspace = create_workspace("Other Tags")
    tag = Tag.create!(workspace: other_workspace, name: "Private")

    delete "/api/v1/workspaces/#{workspace.id}/tags/#{tag.id}", headers: authorization_header

    expect(response).to have_http_status(:not_found)
    expect(tag.reload).to be_persisted
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
