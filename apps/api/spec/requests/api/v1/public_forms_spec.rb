require "rails_helper"

RSpec.describe "Public feedback forms", type: :request do
  let(:workspace) do
    Workspace.create!(
      name: "Signal Studio",
      slug: "signal-studio-public",
      public_form_token: SecureRandom.urlsafe_base64(18),
      public_form_enabled: true
    )
  end
  let(:form_path) { "/api/v1/public/forms/#{workspace.slug}" }
  let(:feedback_path) { "#{form_path}/feedbacks" }
  let(:valid_params) do
    {
      title: "Export settings disappear",
      description: "My selected columns reset every time I return to the export screen.",
      name: "Maya Chen",
      email: " Maya@Example.com ",
      company: "Northstar",
      website: ""
    }
  end

  before do
    Api::V1::Public::FormsController::RATE_LIMIT_STORE.clear
  end

  it "reveals only the public workspace identity when the form is enabled" do
    get form_path

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("form", "workspace_name")).to eq("Signal Studio")
    expect(response.body).not_to include(workspace.public_form_token)
    expect(response.body).not_to include("public_form_enabled")
  end

  it "returns not found when the public form is disabled" do
    workspace.update!(public_form_enabled: false)

    get form_path
    expect(response).to have_http_status(:not_found)

    post feedback_path, params: valid_params
    expect(response).to have_http_status(:not_found)

    post feedback_path, params: valid_params.merge(website: "https://spam.example")
    expect(response).to have_http_status(:not_found)
  end

  it "creates a public Signal, contact and activity event in one request" do
    expect do
      post feedback_path, params: valid_params
    end.to change(Feedback, :count).by(1)
      .and change(Customer, :count).by(1)
      .and change(ActivityEvent, :count).by(1)

    expect(response).to have_http_status(:created)
    feedback = Feedback.last
    expect(feedback).to have_attributes(
      workspace:,
      source: "public_form",
      status: "new",
      priority: "medium",
      created_by: nil
    )
    expect(feedback.customer.email).to eq("maya@example.com")
    expect(response.parsed_body).to include("status" => "accepted")
    expect(response.body).not_to include(feedback.id.to_s)
  end

  it "allows anonymous feedback without creating a contact" do
    params = valid_params.except(:email, :name, :company)

    expect do
      post feedback_path, params:
    end.to change(Feedback, :count).by(1).and change(Customer, :count).by(0)

    expect(response).to have_http_status(:created)
    expect(Feedback.last.customer).to be_nil
  end

  it "rejects oversized or insufficient content with stable field errors" do
    post feedback_path, params: valid_params.merge(title: "  no ", description: "too short")

    expect(response).to have_http_status(:unprocessable_content)
    expect(response.parsed_body.dig("error", "code")).to eq("validation_failed")
    expect(response.parsed_body.dig("error", "details").keys).to contain_exactly("title", "description")
  end

  it "accepts honeypot submissions without writing data" do
    expect do
      post feedback_path, params: valid_params.merge(website: "https://spam.example")
    end.not_to change(Feedback, :count)

    expect(response).to have_http_status(:created)
    expect(response.parsed_body).to include("status" => "accepted")
  end

  it "rate limits repeated submissions per connection and workspace" do
    5.times do |index|
      post feedback_path,
        params: valid_params.except(:email, :name, :company).merge(title: "Repeated Signal #{index}"),
        headers: { "REMOTE_ADDR" => "198.51.100.42" }
      expect(response).to have_http_status(:created)
    end

    post feedback_path,
      params: valid_params.except(:email, :name, :company).merge(title: "One request too many"),
      headers: { "REMOTE_ADDR" => "198.51.100.42" }

    expect(response).to have_http_status(:too_many_requests)
    expect(response.headers["Retry-After"]).to eq("600")
    expect(response.parsed_body.dig("error", "code")).to eq("rate_limited")
  end

  it "allows CORS only for the configured SignalDesk origin" do
    options feedback_path, headers: {
      "Origin" => "http://localhost:3000",
      "Access-Control-Request-Method" => "POST",
      "Access-Control-Request-Headers" => "content-type"
    }

    expect(response).to have_http_status(:ok)
    expect(response.headers["Access-Control-Allow-Origin"]).to eq("http://localhost:3000")

    options feedback_path, headers: {
      "Origin" => "https://malicious.example",
      "Access-Control-Request-Method" => "POST"
    }
    expect(response.headers["Access-Control-Allow-Origin"]).to be_nil
  end
end
