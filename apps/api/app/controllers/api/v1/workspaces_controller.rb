module Api
  module V1
    class WorkspacesController < AuthenticatedController
      def index
        authorize Workspace
        workspaces = policy_scope(Workspace).order(:name)
        render json: { workspaces: workspaces.map { |workspace| workspace_json(workspace) } }
      end

      def create
        workspace = Workspace.new(workspace_params)
        workspace.slug = unique_slug(workspace.name)
        workspace.public_form_token = SecureRandom.urlsafe_base64(18)
        authorize workspace

        ApplicationRecord.transaction do
          workspace.save!
          Membership.create!(workspace:, user: Current.user, role: :owner)
        end

        render json: { workspace: workspace_json(workspace) }, status: :created
      rescue ActiveRecord::RecordInvalid => error
        render_validation_errors(error.record)
      end

      def update
        workspace = policy_scope(Workspace).find(params[:id])
        authorize workspace

        if workspace.update(workspace_params)
          render json: { workspace: workspace_json(workspace) }
        else
          render_validation_errors(workspace)
        end
      end

      private

      def workspace_params
        params.permit(:name, :public_form_enabled)
      end

      def unique_slug(name)
        base = name.to_s.parameterize.presence || "workspace"
        candidate = base
        candidate = "#{base}-#{SecureRandom.hex(3)}" while Workspace.exists?(slug: candidate)
        candidate
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
