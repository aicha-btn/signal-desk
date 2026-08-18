require "rails_helper"

RSpec.describe DemoWorkspaceSeeder do
  let(:owner_attributes) do
    {
      supabase_user_id: SecureRandom.uuid,
      email: "demo-owner@example.test",
      display_name: "Demo Owner"
    }
  end

  it "creates a complete presentation workspace" do
    result = described_class.call(owner_attributes:)
    workspace = Workspace.find(result.fetch(:workspace_id))

    expect(result).to include(
      members: 8,
      customers: 10,
      tags: 7,
      feedbacks: 18,
      comments: 13
    )
    expect(workspace).to be_public_form_enabled
    expect(workspace.memberships.pluck(:role)).to contain_exactly(
      "owner", "admin", "admin", "member", "member", "member", "member", "member"
    )
    expect(workspace.feedbacks.pluck(:status).uniq).to match_array(Feedback::STATUSES)
    expect(workspace.feedbacks.pluck(:priority).uniq).to match_array(Feedback::PRIORITIES)
    expect(workspace.feedbacks.pluck(:source).uniq).to match_array(Feedback::SOURCES)
    expect(workspace.activity_events.pluck(:action).uniq).to match_array(ActivityEvent::ACTIONS)
  end

  it "rebuilds only the dedicated demo workspace when run again" do
    first_result = described_class.call(owner_attributes:)
    first_workspace_id = first_result.fetch(:workspace_id)

    second_result = described_class.call(owner_attributes:)

    expect(second_result.fetch(:workspace_id)).not_to eq(first_workspace_id)
    expect(Workspace.where(slug: described_class::WORKSPACE_SLUG).count).to eq(1)
    expect(Workspace.find(second_result.fetch(:workspace_id)).feedbacks.count).to eq(18)
    expect(User.find_by!(email: owner_attributes.fetch(:email)).memberships.count).to eq(1)
  end

  it "replaces a supplied owner workspace without changing its identity" do
    owner = User.create!(owner_attributes)
    workspace = Workspace.create!(
      name: "Original workspace",
      slug: "original-workspace",
      public_form_token: SecureRandom.urlsafe_base64(18)
    )
    Membership.create!(workspace:, user: owner, role: :owner)
    workspace.customers.create!(name: "Placeholder", company: "Temporary")

    result = described_class.call(
      owner_attributes:,
      workspace:,
      workspace_name: "Budary Product Studio"
    )

    expect(result).to include(workspace_id: workspace.id, workspace_slug: "original-workspace")
    expect(workspace.reload).to have_attributes(name: "Budary Product Studio", public_form_enabled: true)
    expect(workspace.customers.count).to eq(10)
    expect(workspace.feedbacks.count).to eq(18)
    expect(workspace.memberships.find_by!(user: owner)).to be_owner
  end
end
