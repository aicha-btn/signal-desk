require "rails_helper"

RSpec.describe "Early access signups", type: :request do
  let(:valid_params) do
    {
      email: "Product.Lead@example.com",
      company: "Northstar",
      role: "product",
      team_size: "11-50",
      consent: true,
      source: "landing"
    }
  end

  it "creates a normalized signup" do
    expect do
      post "/api/v1/early_access_signups", params: valid_params
    end.to change(EarlyAccessSignup, :count).by(1)

    expect(response).to have_http_status(:created)
    expect(response.parsed_body).to include("status" => "accepted")
    expect(EarlyAccessSignup.last.email).to eq("product.lead@example.com")
  end

  it "returns field errors for invalid input" do
    post "/api/v1/early_access_signups", params: valid_params.merge(email: "not-an-email")

    expect(response).to have_http_status(:unprocessable_content)
    expect(response.parsed_body.dig("error", "code")).to eq("validation_failed")
    expect(response.parsed_body.dig("error", "details", "email")).to be_present
  end

  it "requires contact consent" do
    post "/api/v1/early_access_signups", params: valid_params.merge(consent: false)

    expect(response).to have_http_status(:unprocessable_content)
    expect(response.parsed_body.dig("error", "details", "consent_at")).to be_present
  end

  it "accepts duplicate signups without creating another record" do
    EarlyAccessSignup.create!(valid_params.except(:consent).merge(consent_at: Time.current))

    expect do
      post "/api/v1/early_access_signups", params: valid_params.merge(email: "product.lead@example.com")
    end.not_to change(EarlyAccessSignup, :count)

    expect(response).to have_http_status(:created)
    expect(response.parsed_body).to include("status" => "accepted")
  end

  it "silently accepts honeypot submissions without storing them" do
    expect do
      post "/api/v1/early_access_signups", params: valid_params.merge(website: "https://spam.example")
    end.not_to change(EarlyAccessSignup, :count)

    expect(response).to have_http_status(:created)
    expect(response.parsed_body).to include("status" => "accepted")
  end
end
