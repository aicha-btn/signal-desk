module Api
  module V1
    class EarlyAccessSignupsController < ApplicationController
      ACCEPTED_RESPONSE = {
        status: "accepted",
        message: "You're on the list. We'll be in touch."
      }.freeze

      def create
        return render json: ACCEPTED_RESPONSE, status: :created if bot_submission?

        signup = EarlyAccessSignup.find_or_initialize_by(email: normalized_email)
        if signup.new_record?
          signup.assign_attributes(signup_params.merge(consent_at: consent_given? ? Time.current : nil))
        end

        if !signup.new_record? || signup.save
          render json: ACCEPTED_RESPONSE, status: :created
        else
          render_validation_errors(signup)
        end
      rescue ActiveRecord::RecordNotUnique
        render json: ACCEPTED_RESPONSE, status: :created
      end

      private

      def bot_submission?
        params[:website].present?
      end

      def normalized_email
        params[:email].to_s.strip.downcase
      end

      def consent_given?
        ActiveModel::Type::Boolean.new.cast(params[:consent])
      end

      def signup_params
        params.permit(:email, :company, :role, :team_size, :source)
          .to_h
          .merge("email" => normalized_email, "source" => params[:source].presence || "landing")
      end

      def render_validation_errors(signup)
        render json: {
          error: {
            code: "validation_failed",
            message: "Check the highlighted fields.",
            details: signup.errors.to_hash
          }
        }, status: :unprocessable_content
      end
    end
  end
end
