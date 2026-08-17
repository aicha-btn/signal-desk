class FeedbackSearchQuery
  DEFAULT_PAGE = 1
  DEFAULT_PER_PAGE = 20
  MAX_PER_PAGE = 50
  SORTS = %w[newest oldest priority_desc priority_asc].freeze

  attr_reader :page, :per_page, :sort, :total

  def initialize(workspace:, params:)
    @workspace = workspace
    @params = params
    @page = positive_integer(params[:page], DEFAULT_PAGE)
    @per_page = [ positive_integer(params[:per_page], DEFAULT_PER_PAGE), MAX_PER_PAGE ].min
    @sort = SORTS.include?(params[:sort]) ? params[:sort] : "newest"
  end

  def results
    scope = filtered_scope
    @total = scope.count
    scope.offset((page - 1) * per_page).limit(per_page)
  end

  def metadata
    {
      page:,
      per_page:,
      total: total || filtered_scope.count,
      total_pages: ((total || filtered_scope.count).to_f / per_page).ceil,
      sort:
    }
  end

  private

  attr_reader :workspace, :params

  def filtered_scope
    scope = workspace.feedbacks.all
    scope = scope.where(status: params[:status]) if Feedback::STATUSES.include?(params[:status])
    scope = scope.where(priority: params[:priority]) if Feedback::PRIORITIES.include?(params[:priority])
    scope = scope.where(customer_id: params[:customer_id]) if params[:customer_id].present?
    if params[:tag_id].present?
      tagged_feedback_ids = FeedbackTag.where(tag_id: params[:tag_id]).select(:feedback_id)
      scope = scope.where(id: tagged_feedback_ids)
    end

    if params[:query].present?
      query = "%#{ActiveRecord::Base.sanitize_sql_like(params[:query].strip)}%"
      scope = scope.where("feedbacks.title ILIKE :query OR feedbacks.description ILIKE :query", query:)
    end

    apply_sort(scope)
  end

  def apply_sort(scope)
    priority_rank = <<~SQL.squish
      CASE feedbacks.priority
      WHEN 'critical' THEN 4
      WHEN 'high' THEN 3
      WHEN 'medium' THEN 2
      ELSE 1 END
    SQL

    case sort
    when "oldest"
      scope.order(created_at: :asc, id: :asc)
    when "priority_desc"
      scope.order(Arel.sql("#{priority_rank} DESC, feedbacks.created_at DESC, feedbacks.id DESC"))
    when "priority_asc"
      scope.order(Arel.sql("#{priority_rank} ASC, feedbacks.created_at DESC, feedbacks.id DESC"))
    else
      scope.order(created_at: :desc, id: :desc)
    end
  end

  def positive_integer(value, fallback)
    parsed = value.to_i
    parsed.positive? ? parsed : fallback
  end
end
