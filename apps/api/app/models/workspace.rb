class Workspace < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships
  has_many :customers, dependent: :destroy
  has_many :feedbacks, dependent: :destroy
  has_many :tags, dependent: :destroy

  validates :name, presence: true, length: { maximum: 100 }
  validates :slug,
    presence: true,
    length: { maximum: 120 },
    format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ },
    uniqueness: true
  validates :public_form_token, presence: true, uniqueness: true
end
