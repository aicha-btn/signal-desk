require "rails_helper"

RSpec.describe "API health", type: :request do
  describe "GET /api/v1/health" do
    it "reports that the API and database are available" do
      get "/api/v1/health"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq(
        "status" => "ok",
        "service" => "signal-desk-api",
        "database" => "connected"
      )
    end
  end
end
