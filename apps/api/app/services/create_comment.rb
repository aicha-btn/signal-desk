class CreateComment
  def self.call(workspace:, feedback:, author:, body:)
    new(workspace:, feedback:, author:, body:).call
  end

  def initialize(workspace:, feedback:, author:, body:)
    @workspace = workspace
    @feedback = feedback
    @author = author
    @body = body
  end

  def call
    Comment.transaction do
      comment = feedback.comments.create!(workspace:, author:, body:)
      feedback.activity_events.create!(
        workspace:,
        actor: author,
        action: "comment_created",
        metadata: { comment_id: comment.id }
      )
      comment
    end
  end

  private

  attr_reader :workspace, :feedback, :author, :body
end
