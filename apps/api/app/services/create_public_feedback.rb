class CreatePublicFeedback
  def self.call(workspace:, submission:)
    new(workspace:, submission:).call
  end

  def initialize(workspace:, submission:)
    @workspace = workspace
    @submission = submission
  end

  def call
    Feedback.transaction do
      customer = find_or_create_customer
      CreateFeedback.call(
        workspace:,
        actor: nil,
        attributes: {
          title: attributes[:title],
          description: attributes[:description],
          status: "new",
          priority: "medium",
          source: "public_form",
          customer:
        }
      )
    end
  end

  private

  attr_reader :workspace, :submission

  def attributes
    @attributes ||= submission.normalized_attributes
  end

  def find_or_create_customer
    return if attributes[:email].blank?

    workspace.customers.create_or_find_by!(email: attributes[:email]) do |customer|
      customer.name = attributes[:name].presence || attributes[:email].split("@").first
      customer.company = attributes[:company].presence
    end
  end
end
