require "rails_helper"

RSpec.describe "Signal collaboration", type: :request do
  let(:claims) do
    {
      "sub" => "33333333-3333-4333-8333-333333333333",
      "email" => "collaboration@example.com",
      "user_metadata" => { "display_name" => "Aicha" }
    }
  end
  let(:user) { User.sync_from_supabase!(claims) }
  let(:workspace) { create_workspace("Collaboration Studio") }
  let(:feedback) do
    Feedback.create!(
      workspace:,
      created_by: user,
      title: "Exports need a shared vocabulary",
      description: "The team cannot compare reports across customer accounts."
    )
  end

  before do
    allow(SupabaseJwtVerifier).to receive(:verify).with("valid-token").and_return(claims)
    Membership.find_or_create_by!(user:, workspace:) { |membership| membership.role = :owner }
  end

  it "creates a comment and its activity event in the same request" do
    expect do
      post "/api/v1/workspaces/#{workspace.id}/feedbacks/#{feedback.id}/comments",
        params: { body: "I confirmed this pattern with the support team." },
        headers: authorization_header
    end.to change(Comment, :count).by(1).and change(ActivityEvent, :count).by(1)

    expect(response).to have_http_status(:created)
    expect(response.parsed_body.dig("comment", "author", "display_name")).to eq("Aicha")
    expect(feedback.activity_events.last).to have_attributes(
      action: "comment_created",
      actor: user,
      metadata: { "comment_id" => Comment.last.id }
    )
    expect(response.parsed_body.dig("comment", "can_delete")).to be(true)

    comment_id = response.parsed_body.dig("comment", "id")
    expect do
      delete "/api/v1/workspaces/#{workspace.id}/feedbacks/#{feedback.id}/comments/#{comment_id}",
        headers: authorization_header
    end.to change(Comment, :count).by(-1)

    expect(response).to have_http_status(:no_content)
  end

  it "lists comments and activity without exposing another workspace" do
    CreateComment.call(
      workspace:,
      feedback:,
      author: user,
      body: "This belongs to the current room."
    )

    get "/api/v1/workspaces/#{workspace.id}/feedbacks/#{feedback.id}/comments",
      headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("comments", 0, "body")).to eq("This belongs to the current room.")

    get "/api/v1/workspaces/#{workspace.id}/feedbacks/#{feedback.id}/activity_events",
      headers: authorization_header

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.fetch("activity_events").pluck("action")).to eq([ "comment_created" ])

    other_workspace = create_workspace("Private Room")
    other_feedback = Feedback.create!(
      workspace: other_workspace,
      title: "Private Signal",
      description: "This Signal must stay outside the current workspace."
    )

    get "/api/v1/workspaces/#{workspace.id}/feedbacks/#{other_feedback.id}/comments",
      headers: authorization_header

    expect(response).to have_http_status(:not_found)
  end

  it "rejects empty comments without writing an activity event" do
    expect do
      post "/api/v1/workspaces/#{workspace.id}/feedbacks/#{feedback.id}/comments",
        params: { body: "" },
        headers: authorization_header
    end.not_to change(ActivityEvent, :count)

    expect(response).to have_http_status(:unprocessable_content)
    expect(Comment.count).to eq(0)
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
