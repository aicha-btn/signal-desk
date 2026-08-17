module Api
  module V1
    class CommentsController < WorkspaceController
      before_action :set_feedback

      def index
        comments = @feedback.comments.includes(:author).order(created_at: :asc, id: :asc)
        render json: { comments: comments.map { |comment| comment_json(comment) } }
      end

      def create
        comment = CreateComment.call(
          workspace: Current.workspace,
          feedback: @feedback,
          author: Current.user,
          body: comment_params[:body]
        )
        render json: { comment: comment_json(comment) }, status: :created
      rescue ActiveRecord::RecordInvalid => error
        render_validation_errors(error.record)
      end

      def destroy
        comment = @feedback.comments.find(params[:id])
        authorize comment
        comment.destroy!
        head :no_content
      end

      private

      def set_feedback
        @feedback = Current.workspace.feedbacks.find(params[:feedback_id])
      end

      def comment_params
        params.permit(:body)
      end

      def comment_json(comment)
        {
          id: comment.id,
          body: comment.body,
          author: {
            id: comment.author.id,
            display_name: comment.author.display_name,
            email: comment.author.email
          },
          can_delete: policy(comment).destroy?,
          created_at: comment.created_at.iso8601
        }
      end
    end
  end
end
