module Api
  module V1
    class ActivityEventsController < WorkspaceController
      before_action :set_feedback

      def index
        events = @feedback.activity_events.includes(:actor).order(created_at: :asc, id: :asc)
        render json: { activity_events: events.map { |event| event_json(event) } }
      end

      private

      def set_feedback
        @feedback = Current.workspace.feedbacks.find(params[:feedback_id])
      end

      def event_json(event)
        {
          id: event.id,
          action: event.action,
          metadata: event.metadata,
          actor: event.actor && {
            id: event.actor.id,
            display_name: event.actor.display_name,
            email: event.actor.email
          },
          created_at: event.created_at.iso8601
        }
      end
    end
  end
end
