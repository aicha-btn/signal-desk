class PublicFeedbackSubmission
  include ActiveModel::Model
  include ActiveModel::Attributes
  include ActiveModel::Validations::Callbacks

  attribute :title, :string
  attribute :description, :string
  attribute :name, :string
  attribute :email, :string
  attribute :company, :string

  validates :title, presence: true, length: { minimum: 5, maximum: 160 }
  validates :description, presence: true, length: { minimum: 20, maximum: 4_000 }
  validates :name, length: { maximum: 100 }, allow_blank: true
  validates :company, length: { maximum: 100 }, allow_blank: true
  validates :email,
    length: { maximum: 254 },
    format: { with: URI::MailTo::EMAIL_REGEXP },
    allow_blank: true

  before_validation :normalize

  def normalized_attributes
    {
      title: title.to_s.strip,
      description: description.to_s.strip,
      name: name.to_s.strip,
      email: email.to_s.strip.downcase,
      company: company.to_s.strip
    }
  end


  private

  def normalize
    self.title = title.to_s.strip
    self.description = description.to_s.strip
    self.name = name.to_s.strip
    self.email = email.to_s.strip.downcase
    self.company = company.to_s.strip
  end
end
