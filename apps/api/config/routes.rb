Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resource :health, only: :show, controller: :health
      resources :early_access_signups, only: :create
      resource :me, only: :show, controller: :me
      resource :onboarding, only: :create, controller: :onboarding
      resources :workspaces, only: %i[index create update] do
        resources :feedbacks, only: %i[index create show update destroy]
        resources :customers, only: %i[index create]
        resources :members, only: :index
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
