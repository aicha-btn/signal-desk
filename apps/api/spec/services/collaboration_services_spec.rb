require "rails_helper"

RSpec.describe "Collaboration services" do
  let(:workspace) do
    Workspace.create!(
      name: "Service Studio",
      slug: "service-studio-#{SecureRandom.hex(2)}",
      public_form_token: SecureRandom.urlsafe_base64(18)
    )
  end
  let(:user) do
    User.create!(
      supabase_user_id: SecureRandom.uuid,
      email: "services@example.com",
      display_name: "Service Owner"
    )
  end

  before do
    Membership.create!(workspace:, user:, role: :owner)
  end

  it "creates and updates a Signal with its audit events" do
    feedback = CreateFeedback.call(
      workspace:,
      actor: user,
      attributes: {
        title: "A transactional Signal",
        description: "The business record and audit record stay aligned."
      }
    )

    UpdateFeedback.call(
      feedback:,
      actor: user,
      attributes: { status: "reviewing", priority: "critical" }
    )

    expect(feedback.activity_events.order(:created_at).pluck(:action)).to eq([
      "feedback_created",
      "feedback_status_changed",
      "feedback_priority_changed"
    ])
  end

  it "rolls a comment back when its activity event cannot be persisted" do
    feedback = Feedback.create!(
      workspace:,
      created_by: user,
      title: "Rollback Signal",
      description: "A failed audit write must also reject the comment."
    )
    allow(feedback.activity_events).to receive(:create!).and_raise(ActiveRecord::RecordInvalid)

    expect do
      CreateComment.call(workspace:, feedback:, author: user, body: "Never partially stored")
    end.to raise_error(ActiveRecord::RecordInvalid)

    expect(Comment.where(feedback:)).to be_empty
  end
end
