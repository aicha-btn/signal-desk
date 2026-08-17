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
        feedback = Current.workspace.feedbacks.new(feedback_params)
        feedback.created_by = Current.user

        if save_feedback(feedback)
          render json: { feedback: feedback_json(feedback) }, status: :created
        else
          render_validation_errors(feedback)
        end
      end

      def update
        feedback = Current.workspace.feedbacks.find(params[:id])
        feedback.assign_attributes(feedback_params)

        if save_feedback(feedback)
          render json: { feedback: feedback_json(feedback) }
        else
          render_validation_errors(feedback)
        end
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

      def save_feedback(feedback)
        Feedback.transaction do
          feedback.tags = requested_tags if params.key?(:tag_ids)
          feedback.save!
        end
        true
      rescue ActiveRecord::RecordInvalid
        false
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
