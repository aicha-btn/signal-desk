module Api
  module V1
    class MeController < AuthenticatedController
      def show
        workspaces = policy_scope(Workspace).order(:created_at)

        render json: {
          user: {
            id: Current.user.id,
            email: Current.user.email,
            display_name: Current.user.display_name
          },
          workspaces: workspaces.map { |workspace| workspace_json(workspace) },
          onboarding_required: workspaces.empty?
        }
      end
    end
  end
end
