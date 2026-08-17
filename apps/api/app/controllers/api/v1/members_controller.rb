module Api
  module V1
    class MembersController < WorkspaceController
      def index
        memberships = Current.workspace.memberships.includes(:user).order(:created_at)

        render json: {
          members: memberships.map do |membership|
            {
              id: membership.id,
              role: membership.role,
              joined_at: membership.created_at.iso8601,
              user: {
                id: membership.user.id,
                email: membership.user.email,
                display_name: membership.user.display_name
              }
            }
          end
        }
      end
    end
  end
end
