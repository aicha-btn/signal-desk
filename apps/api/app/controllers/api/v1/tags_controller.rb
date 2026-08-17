module Api
  module V1
    class TagsController < WorkspaceController
      def index
        tags = Current.workspace.tags.left_joins(:feedback_tags)
          .select("tags.*, COUNT(feedback_tags.id) AS feedbacks_count")
          .group("tags.id")
          .order(Arel.sql("LOWER(tags.name) ASC"))

        render json: { tags: tags.map { |tag| tag_json(tag) } }
      end

      def create
        tag = Current.workspace.tags.new(tag_params)

        if tag.save
          render json: { tag: tag_json(tag) }, status: :created
        else
          render_validation_errors(tag)
        end
      end

      def update
        tag = Current.workspace.tags.find(params[:id])

        if tag.update(tag_params)
          render json: { tag: tag_json(tag) }
        else
          render_validation_errors(tag)
        end
      end

      def destroy
        Current.workspace.tags.find(params[:id]).destroy!
        head :no_content
      end

      private

      def tag_params
        params.permit(:name)
      end

      def tag_json(tag)
        {
          id: tag.id,
          name: tag.name,
          feedbacks_count: tag.respond_to?(:feedbacks_count) ? tag.feedbacks_count.to_i : tag.feedbacks.count
        }
      end
    end
  end
end
