class DemoWorkspaceSeeder
  WORKSPACE_SLUG = "northstar-product-studio".freeze

  TEAM = [
    {
      key: :nora,
      supabase_user_id: "00000000-0000-4000-8000-000000000101",
      email: "nora.okafor@signaldesk.test",
      display_name: "Nora Okafor",
      role: :admin
    },
    {
      key: :mika,
      supabase_user_id: "00000000-0000-4000-8000-000000000102",
      email: "mika.laurent@signaldesk.test",
      display_name: "Mika Laurent",
      role: :member
    },
    {
      key: :amir,
      supabase_user_id: "00000000-0000-4000-8000-000000000103",
      email: "amir.haddad@signaldesk.test",
      display_name: "Amir Haddad",
      role: :member
    }
  ].freeze

  CUSTOMERS = {
    helio: { name: "Sofia Marin", company: "Helio Systems", email: "sofia@helio.example" },
    kanso: { name: "Tom Becker", company: "Kanso Labs", email: "tom@kanso.example" },
    arcwell: { name: "Leila Rahman", company: "Arcwell", email: "leila@arcwell.example" },
    looma: { name: "Jon Bell", company: "Looma", email: "jon@looma.example" },
    verdant: { name: "Camille Roy", company: "Verdant Cloud", email: "camille@verdant.example" }
  }.freeze

  TAGS = %w[Reporting Permissions Integrations Mobile Security Workflow Billing].freeze

  FEEDBACKS = [
    {
      title: "Export loses selected columns",
      description: "CSV exports fall back to the default column set, even after a team saves a custom reporting view.",
      status: "planned", priority: "high", source: "support", customer: :helio,
      creator: :nora, tags: %w[Reporting Workflow], days_ago: 32,
      comments: [
        { author: :mika, days_after: 2, body: "Reproduced with two saved views. The export serializer never receives the selected column IDs." },
        { author: :nora, days_after: 5, body: "Scoped for the next reporting cycle. We will preserve ordering as well as visibility." }
      ]
    },
    {
      title: "Guest permissions expose internal notes",
      description: "A guest opening a shared customer view can briefly see the internal-note count before permissions finish loading.",
      status: "reviewing", priority: "critical", source: "call", customer: :kanso,
      creator: :owner, tags: %w[Permissions Security], days_ago: 27,
      comments: [
        { author: :amir, days_after: 1, body: "The API response is protected. The leak is limited to optimistic UI state, but the trust impact is real." }
      ]
    },
    {
      title: "Bulk merge duplicate contacts",
      description: "Customer success teams need to merge imported contacts without losing linked Signals or timeline history.",
      status: "new", priority: "medium", source: "email", customer: :arcwell,
      creator: :mika, tags: %w[Workflow], days_ago: 21
    },
    {
      title: "Decision history disappears after refresh",
      description: "The activity timeline sometimes omits the latest status transition until another change is recorded.",
      status: "reviewing", priority: "high", source: "internal", customer: nil,
      creator: :amir, tags: %w[Workflow Reporting], days_ago: 18,
      comments: [
        { author: :owner, days_after: 2, body: "This blocks reliable handoffs. Please keep the event ordering deterministic when the fix lands." }
      ]
    },
    {
      title: "Mobile composer covers the final reply",
      description: "On smaller screens the sticky composer overlaps the last discussion message and its action menu.",
      status: "new", priority: "medium", source: "public_form", customer: :looma,
      creator: nil, tags: %w[Mobile], days_ago: 15
    },
    {
      title: "Slack import duplicates threaded replies",
      description: "Replies imported from long Slack threads appear once as a reply and again as a standalone Signal.",
      status: "planned", priority: "high", source: "support", customer: :verdant,
      creator: :nora, tags: %w[Integrations Workflow], days_ago: 13,
      comments: [
        { author: :amir, days_after: 2, body: "The provider message ID is stable. We can use it as the idempotency key during ingestion." }
      ]
    },
    {
      title: "Weekly digest needs workspace filters",
      description: "Leads want one digest per workspace instead of a combined email spanning every team they belong to.",
      status: "resolved", priority: "low", source: "email", customer: :helio,
      creator: :mika, tags: %w[Reporting], days_ago: 11,
      comments: [
        { author: :nora, days_after: 4, body: "Released behind the existing digest preference. Helio confirmed the new grouping works." }
      ]
    },
    {
      title: "Roadmap view needs a client-safe mode",
      description: "Teams need a presentation view that hides internal priority, assignees and private discussion before a customer call.",
      status: "planned", priority: "high", source: "call", customer: :kanso,
      creator: :owner, tags: %w[Permissions Reporting], days_ago: 9
    },
    {
      title: "SSO setup lacks domain verification feedback",
      description: "Admins cannot tell whether DNS verification is pending, failed or waiting for another propagation check.",
      status: "resolved", priority: "critical", source: "support", customer: :arcwell,
      creator: :nora, tags: %w[Integrations Security], days_ago: 7,
      comments: [
        { author: :mika, days_after: 2, body: "Added explicit pending and failed states, plus the timestamp of the latest verification attempt." }
      ]
    },
    {
      title: "Saved search resets after a role change",
      description: "Changing a member from admin to member clears saved filters that are still valid for the new permission set.",
      status: "reviewing", priority: "medium", source: "internal", customer: :looma,
      creator: :amir, tags: %w[Permissions Workflow], days_ago: 5
    },
    {
      title: "Public form confirmation feels uncertain",
      description: "Submitters need a stronger confirmation that their Signal arrived without exposing any workspace data.",
      status: "resolved", priority: "low", source: "public_form", customer: nil,
      creator: nil, tags: %w[Workflow], days_ago: 3,
      comments: [
        { author: :owner, days_after: 1, body: "The new confirmation keeps the form anonymous while making the successful handoff unmistakable." }
      ]
    },
    {
      title: "Owners need an invitation audit trail",
      description: "Workspace owners want to see who invited, revoked or re-sent each pending membership invitation.",
      status: "new", priority: "medium", source: "other", customer: :verdant,
      creator: :owner, tags: %w[Permissions Security], days_ago: 1
    }
  ].freeze

  def self.call(owner_attributes:)
    new(owner_attributes:).call
  end

  def initialize(owner_attributes:)
    @owner_attributes = owner_attributes.symbolize_keys
  end

  def call
    ApplicationRecord.transaction do
      owner = upsert_user(owner_attributes)
      Workspace.find_by(slug: WORKSPACE_SLUG)&.destroy!

      workspace = Workspace.create!(
        name: "Northstar Product Studio",
        slug: WORKSPACE_SLUG,
        public_form_enabled: true,
        public_form_token: SecureRandom.urlsafe_base64(18),
        created_at: 90.days.ago,
        updated_at: 2.hours.ago
      )

      people = create_team(workspace, owner)
      customers = create_customers(workspace)
      tags = TAGS.index_with { |name| workspace.tags.create!(name:) }

      FEEDBACKS.each do |definition|
        create_feedback(workspace, people, customers, tags, definition)
      end

      {
        workspace_id: workspace.id,
        workspace_slug: workspace.slug,
        public_form_token: workspace.public_form_token,
        members: workspace.memberships.count,
        customers: workspace.customers.count,
        tags: workspace.tags.count,
        feedbacks: workspace.feedbacks.count,
        comments: workspace.comments.count,
        activity_events: workspace.activity_events.count
      }
    end
  end

  private

  attr_reader :owner_attributes

  def create_team(workspace, owner)
    people = { owner: }
    Membership.create!(workspace:, user: owner, role: :owner)

    TEAM.each do |definition|
      user = upsert_user(definition.slice(:supabase_user_id, :email, :display_name))
      Membership.create!(workspace:, user:, role: definition.fetch(:role))
      people[definition.fetch(:key)] = user
    end

    people
  end

  def create_customers(workspace)
    CUSTOMERS.transform_values do |attributes|
      workspace.customers.create!(attributes)
    end
  end

  def create_feedback(workspace, people, customers, tags, definition)
    created_at = definition.fetch(:days_ago).days.ago.change(usec: 0)
    actor = definition[:creator] && people.fetch(definition[:creator])
    feedback = CreateFeedback.call(
      workspace:,
      actor:,
      attributes: {
        title: definition.fetch(:title),
        description: definition.fetch(:description),
        status: "new",
        priority: "medium",
        source: definition.fetch(:source),
        customer: definition[:customer] && customers.fetch(definition[:customer])
      },
      tags: definition.fetch(:tags).map { |name| tags.fetch(name) }
    )

    feedback.update_columns(created_at:, updated_at: created_at)
    feedback.activity_events.find_by!(action: "feedback_created").update_columns(
      created_at: created_at + 5.minutes,
      updated_at: created_at + 5.minutes
    )

    apply_final_state(feedback, actor, definition, created_at)
    create_comments(workspace, feedback, people, definition.fetch(:comments, []), created_at)
    feedback
  end

  def apply_final_state(feedback, actor, definition, created_at)
    final_attributes = {
      status: definition.fetch(:status),
      priority: definition.fetch(:priority)
    }
    return if final_attributes.values_at(:status, :priority) == [ "new", "medium" ]

    UpdateFeedback.call(feedback:, actor:, attributes: final_attributes)
    transition_time = created_at + 1.day
    feedback.activity_events.where.not(action: "feedback_created").order(:id).each_with_index do |event, index|
      event.update_columns(created_at: transition_time + index.hours, updated_at: transition_time + index.hours)
    end
    feedback.update_columns(updated_at: transition_time + 2.hours)
  end

  def create_comments(workspace, feedback, people, comments, created_at)
    comments.each_with_index do |definition, index|
      comment = CreateComment.call(
        workspace:,
        feedback:,
        author: people.fetch(definition.fetch(:author)),
        body: definition.fetch(:body)
      )
      timestamp = created_at + definition.fetch(:days_after).days + index.hours
      comment.update_columns(created_at: timestamp, updated_at: timestamp)
      feedback.activity_events.order(:id).last.update_columns(created_at: timestamp, updated_at: timestamp)
      feedback.update_columns(updated_at: timestamp)
    end
  end

  def upsert_user(attributes)
    normalized = attributes.symbolize_keys
    user = User.find_by(supabase_user_id: normalized.fetch(:supabase_user_id)) ||
      User.find_by("LOWER(email) = ?", normalized.fetch(:email).downcase) ||
      User.new
    user.update!(normalized)
    user
  end
end
