class OnboardUser
  def self.call(user:, workspace_name:, display_name:)
    new(user:, workspace_name:, display_name:).call
  end

  def initialize(user:, workspace_name:, display_name:)
    @user = user
    @workspace_name = workspace_name.to_s.strip
    @display_name = display_name.to_s.strip
  end

  def call
    existing_workspace = user.workspaces.first
    return existing_workspace if existing_workspace

    ApplicationRecord.transaction do
      user.update!(display_name:) if display_name.present?
      workspace = Workspace.create!(
        name: workspace_name,
        slug: unique_slug,
        public_form_token: SecureRandom.urlsafe_base64(18)
      )
      Membership.create!(user:, workspace:, role: :owner)
      workspace
    end
  end

  private

  attr_reader :user, :workspace_name, :display_name

  def unique_slug
    base = workspace_name.parameterize.presence || "workspace"
    candidate = base
    candidate = "#{base}-#{SecureRandom.hex(3)}" while Workspace.exists?(slug: candidate)
    candidate
  end
end
