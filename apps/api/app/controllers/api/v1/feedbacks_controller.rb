module Api
  module V1
    class FeedbacksController < WorkspaceController
      def index
        feedbacks = Current.workspace.feedbacks.includes(:customer, :created_by).order(created_at: :desc)
        feedbacks = feedbacks.where(status: params[:status]) if Feedback::STATUSES.include?(params[:status])
        feedbacks = feedbacks.where(priority: params[:priority]) if Feedback::PRIORITIES.include?(params[:priority])
        if params[:query].present?
          query = "%#{ActiveRecord::Base.sanitize_sql_like(params[:query].strip)}%"
          feedbacks = feedbacks.where("feedbacks.title ILIKE :query OR feedbacks.description ILIKE :query", query:)
        end

        render json: {
          feedbacks: feedbacks.limit(100).map { |feedback| feedback_json(feedback) },
          total: feedbacks.count
        }
      end

      def show
        feedback = Current.workspace.feedbacks.includes(:customer, :created_by).find(params[:id])
        render json: { feedback: feedback_json(feedback) }
      end

      def create
        feedback = Current.workspace.feedbacks.new(feedback_params)
        feedback.created_by = Current.user

        if feedback.save
          render json: { feedback: feedback_json(feedback) }, status: :created
        else
          render_validation_errors(feedback)
        end
      end

      def update
        feedback = Current.workspace.feedbacks.find(params[:id])

        if feedback.update(feedback_params)
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

      def feedback_json(feedback)
        {
          id: feedback.id,
          title: feedback.title,
          description: feedback.description,
          status: feedback.status,
          priority: feedback.priority,
          source: feedback.source,
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
