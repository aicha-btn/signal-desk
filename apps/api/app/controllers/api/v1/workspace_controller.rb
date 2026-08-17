module Api
  module V1
    class WorkspaceController < AuthenticatedController
      before_action :set_workspace

      private

      def set_workspace
        Current.workspace = policy_scope(Workspace).find(params[:workspace_id])
        authorize Current.workspace, :show?
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
