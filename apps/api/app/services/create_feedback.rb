class CreateFeedback
  def self.call(workspace:, actor:, attributes:, tags: [])
    new(workspace:, actor:, attributes:, tags:).call
  end

  def initialize(workspace:, actor:, attributes:, tags:)
    @workspace = workspace
    @actor = actor
    @attributes = attributes
    @tags = tags
  end

  def call
    Feedback.transaction do
      feedback = workspace.feedbacks.new(attributes)
      feedback.created_by = actor
      feedback.tags = tags
      feedback.save!
      feedback.activity_events.create!(workspace:, actor:, action: "feedback_created")
      feedback
    end
  end

  private

  attr_reader :workspace, :actor, :attributes, :tags
end
