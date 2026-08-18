module Api
  module V1
    class CustomersController < WorkspaceController
      before_action :set_customer, only: %i[show update destroy]

      def index
        customers = Current.workspace.customers.order(Arel.sql("LOWER(name)"))
        render json: { customers: customers.map { |customer| customer_json(customer) } }
      end

      def create
        customer = Current.workspace.customers.new(customer_params)

        if customer.save
          render json: { customer: customer_json(customer) }, status: :created
        else
          render_validation_errors(customer)
        end
      end

      def show
        render json: { customer: customer_json(@customer) }
      end

      def update
        if @customer.update(customer_params)
          render json: { customer: customer_json(@customer) }
        else
          render_validation_errors(@customer)
        end
      end

      def destroy
        @customer.destroy!
        head :no_content
      end

      private

      def set_customer
        @customer = Current.workspace.customers.find(params[:id])
      end

      def customer_params
        params.permit(:name, :company, :email)
      end

      def customer_json(customer)
        {
          id: customer.id,
          name: customer.name,
          company: customer.company,
          email: customer.email,
          signals_count: customer.feedbacks.count,
          created_at: customer.created_at.iso8601
        }
      end
    end
  end
end
