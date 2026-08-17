module Api
  module V1
    class FeedbacksController < WorkspaceController
      def index
        search = FeedbackSearchQuery.new(workspace: Current.workspace, params:)
        feedbacks = search.results.includes(:customer, :created_by, :tags)

        render json: {
          feedbacks: feedbacks.map { |feedback| feedback_json(feedback) },
          total: search.total,
          meta: search.metadata
        }
      end

      def show
        feedback = Current.workspace.feedbacks.includes(:customer, :created_by, :tags).find(params[:id])
        render json: { feedback: feedback_json(feedback) }
      end

      def create
        feedback = CreateFeedback.call(
          workspace: Current.workspace,
          actor: Current.user,
          attributes: feedback_params,
          tags: params.key?(:tag_ids) ? requested_tags : []
        )
        render json: { feedback: feedback_json(feedback) }, status: :created
      rescue ActiveRecord::RecordInvalid => error
        render_validation_errors(error.record)
      end

      def update
        feedback = Current.workspace.feedbacks.find(params[:id])
        feedback = UpdateFeedback.call(
          feedback:,
          actor: Current.user,
          attributes: feedback_params,
          tags: params.key?(:tag_ids) ? requested_tags : nil
        )
        render json: { feedback: feedback_json(feedback) }
      rescue ActiveRecord::RecordInvalid => error
        render_validation_errors(error.record)
      end

      def destroy
        feedback = Current.workspace.feedbacks.find(params[:id])
        feedback.destroy!
        head :no_content
      end

      private

      def feedback_params
        permitted = params.permit(:title, :description, :status, :priority, :source, :customer_id)
        if permitted.key?(:customer_id)
          if permitted[:customer_id].present?
            Current.workspace.customers.find(permitted[:customer_id])
          else
            permitted[:customer_id] = nil
          end
        end
        permitted
      end

      def requested_tags
        ids = Array(params[:tag_ids]).compact_blank.map(&:to_i).uniq
        tags = Current.workspace.tags.where(id: ids).to_a
        raise ActiveRecord::RecordNotFound unless tags.size == ids.size

        tags
      end

      def feedback_json(feedback)
        {
          id: feedback.id,
          title: feedback.title,
          description: feedback.description,
          status: feedback.status,
          priority: feedback.priority,
          source: feedback.source,
          tags: feedback.tags.sort_by { |tag| tag.name.downcase }.map { |tag| { id: tag.id, name: tag.name } },
          customer: feedback.customer && {
            id: feedback.customer.id,
            name: feedback.customer.name,
            company: feedback.customer.company
          },
          created_by: feedback.created_by && {
            id: feedback.created_by.id,
            display_name: feedback.created_by.display_name,
            email: feedback.created_by.email
          },
          created_at: feedback.created_at.iso8601,
          updated_at: feedback.updated_at.iso8601
        }
      end
    end
  end
end
