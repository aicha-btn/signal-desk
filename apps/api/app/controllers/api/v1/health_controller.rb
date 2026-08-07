module Api
  module V1
    class HealthController < ApplicationController
      def show
        ActiveRecord::Base.connection.select_value("SELECT 1")

        render json: {
          status: "ok",
          service: "signal-desk-api",
          database: "connected"
        }
      rescue ActiveRecord::ActiveRecordError => error
        Rails.logger.error("Health check database failure: #{error.class}")

        render json: {
          status: "error",
          service: "signal-desk-api",
          database: "unavailable"
        }, status: :service_unavailable
      end
    end
  end
end
