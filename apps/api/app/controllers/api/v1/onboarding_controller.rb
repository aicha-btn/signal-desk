module Api
  module V1
    class OnboardingController < AuthenticatedController
      def create
        workspace = OnboardUser.call(
          user: Current.user,
          workspace_name: onboarding_params[:workspace_name],
          display_name: onboarding_params[:display_name]
        )
        authorize workspace, :show?

        render json: { workspace: workspace_json(workspace) }, status: :created
      rescue ActiveRecord::RecordInvalid => error
        render json: {
          error: {
            code: "validation_failed",
            message: "Check the highlighted fields.",
            details: error.record.errors.to_hash
          }
        }, status: :unprocessable_content
      end

      private

      def onboarding_params
        params.permit(:workspace_name, :display_name)
      end
    end
  end
end
