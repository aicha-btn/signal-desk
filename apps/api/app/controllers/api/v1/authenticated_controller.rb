module Api
  module V1
    class AuthenticatedController < ApplicationController
      include Pundit::Authorization

      before_action :authenticate_user!
      rescue_from Pundit::NotAuthorizedError, with: :render_forbidden

      private

      def authenticate_user!
        Current.user = User.sync_from_supabase!(SupabaseJwtVerifier.verify(bearer_token))
      rescue SupabaseJwtVerifier::AuthenticationError, ActiveRecord::RecordInvalid
        render json: {
          error: { code: "unauthorized", message: "A valid session is required." }
        }, status: :unauthorized
      end

      def bearer_token
        scheme, token = request.authorization.to_s.split(" ", 2)
        raise SupabaseJwtVerifier::AuthenticationError, "Bearer token is missing" unless scheme == "Bearer" && token.present?

        token
      end

      def render_forbidden
        render json: {
          error: { code: "forbidden", message: "You do not have permission to perform this action." }
        }, status: :forbidden
      end

      def pundit_user
        Current.user
      end

      def workspace_json(workspace)
        membership = workspace.memberships.find_by!(user: Current.user)

        {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          role: membership.role,
          public_form_enabled: workspace.public_form_enabled
        }
      end
    end
  end
end
