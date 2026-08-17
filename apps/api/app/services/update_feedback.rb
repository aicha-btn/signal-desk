class UpdateFeedback
  def self.call(feedback:, actor:, attributes:, tags: nil)
    new(feedback:, actor:, attributes:, tags:).call
  end

  def initialize(feedback:, actor:, attributes:, tags:)
    @feedback = feedback
    @actor = actor
    @attributes = attributes
    @tags = tags
  end

  def call
    Feedback.transaction do
      feedback.assign_attributes(attributes)
      feedback.tags = tags unless tags.nil?
      feedback.save!
      record_change("feedback_status_changed", feedback.saved_change_to_status)
      record_change("feedback_priority_changed", feedback.saved_change_to_priority)
      feedback
    end
  end

  private

  attr_reader :feedback, :actor, :attributes, :tags

  def record_change(action, change)
    return unless change

    feedback.activity_events.create!(
      workspace: feedback.workspace,
      actor:,
      action:,
      metadata: { from: change.first, to: change.last }
    )
  end
end
