module Api
  module V1
    class InvitationsController < AuthenticatedController
      before_action :set_workspace, only: %i[index create destroy]
      before_action :set_invitation_by_id, only: :destroy
      before_action :set_invitation_by_token, only: %i[show accept]

      def index
        authorize Current.workspace, policy_class: WorkspaceInvitationPolicy
        invitations = Current.workspace.workspace_invitations.pending.includes(:invited_by).order(created_at: :desc)

        render json: { invitations: invitations.map { |invitation| invitation_json(invitation) } }
      end

      def show
        authorize @invitation

        render json: { invitation: invitation_json(@invitation).merge(workspace: workspace_summary(@invitation.workspace)) }
      end

      def create
        authorize Current.workspace, policy_class: WorkspaceInvitationPolicy
        invitation = InviteWorkspaceMember.new(
          workspace: Current.workspace,
          invited_by: Current.user,
          email: params[:email],
          role: params[:role]
        ).call

        render json: { invitation: invitation_json(invitation) }, status: :created
      rescue InviteWorkspaceMember::Error => error
        render_invitation_error(error.message)
      rescue ActiveRecord::RecordInvalid => error
        render_validation_errors(error.record)
      end

      def accept
        authorize @invitation, :accept?
        membership = AcceptWorkspaceInvitation.new(invitation: @invitation, user: Current.user).call

        render json: {
          membership: {
            id: membership.id,
            role: membership.role,
            workspace: workspace_json(membership.workspace)
          }
        }
      rescue AcceptWorkspaceInvitation::Error => error
        render_invitation_error(error.message)
      end

      def destroy
        authorize @invitation
        @invitation.destroy!
        head :no_content
      end

      private

      def set_workspace
        Current.workspace = policy_scope(Workspace).find(params[:workspace_id])
      end

      def set_invitation_by_id
        @invitation = Current.workspace.workspace_invitations.find(params[:id])
      end

      def set_invitation_by_token
        @invitation = WorkspaceInvitation.find_by_token(params[:token])
        raise ActiveRecord::RecordNotFound unless @invitation
      end

      def invitation_json(invitation)
        {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.pending? ? "pending" : invitation.accepted_at.present? ? "accepted" : "expired",
          expires_at: invitation.expires_at.iso8601,
          created_at: invitation.created_at.iso8601,
          invited_by: {
            id: invitation.invited_by.id,
            email: invitation.invited_by.email,
            display_name: invitation.invited_by.display_name
          }
        }
      end

      def workspace_summary(workspace)
        { id: workspace.id, name: workspace.name, slug: workspace.slug }
      end

      def render_invitation_error(message)
        render json: {
          error: { code: "invitation_invalid", message: }
        }, status: :unprocessable_content
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
