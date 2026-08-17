module Api
  module V1
    module Public
      class FormsController < ApplicationController
        RATE_LIMIT_STORE = ActiveSupport::Cache::MemoryStore.new(size: 4.megabytes)
        ACCEPTED_RESPONSE = {
          status: "accepted",
          message: "Your Signal is in the room. Thank you."
        }.freeze

        rate_limit to: 5,
          within: 10.minutes,
          by: -> { "#{request.remote_ip}:#{params[:slug]}" },
          with: :render_rate_limited,
          store: RATE_LIMIT_STORE,
          name: "public-form-burst",
          only: :create
        rate_limit to: 30,
          within: 1.day,
          by: -> { "#{request.remote_ip}:#{params[:slug]}" },
          with: :render_rate_limited,
          store: RATE_LIMIT_STORE,
          name: "public-form-daily",
          only: :create

        def show
          workspace = enabled_workspace
          render json: { form: public_form_json(workspace) }
        end

        def create
          workspace = enabled_workspace
          return accept_honeypot if params[:website].present?

          submission = PublicFeedbackSubmission.new(submission_attributes)
          return render_validation_errors(submission) unless submission.valid?

          CreatePublicFeedback.call(workspace:, submission:)
          render json: ACCEPTED_RESPONSE, status: :created
        rescue ActiveRecord::RecordInvalid => error
          render_validation_errors(error.record)
        end

        private

        def enabled_workspace
          Workspace.find_by!(slug: params[:slug], public_form_enabled: true)
        end

        def submission_attributes
          {
            title: params[:title],
            description: params[:description],
            name: params[:name],
            email: params[:email],
            company: params[:company]
          }
        end

        def public_form_json(workspace)
          { workspace_name: workspace.name, slug: workspace.slug }
        end

        def accept_honeypot
          Rails.logger.info("public_form_rejected reason=honeypot request_id=#{request.request_id}")
          render json: ACCEPTED_RESPONSE, status: :created
        end

        def render_rate_limited
          Rails.logger.info("public_form_rejected reason=rate_limit request_id=#{request.request_id}")
          response.set_header("Retry-After", "600")
          render json: {
            error: {
              code: "rate_limited",
              message: "Too many Signals were sent from this connection. Try again later."
            }
          }, status: :too_many_requests
        end

        def render_validation_errors(record)
          render json: {
            error: {
              code: "validation_failed",
              message: "Check the highlighted fields.",
              details: record.errors.to_hash
            }
          }, status: :unprocessable_content
        end
      end
    end
  end
end
