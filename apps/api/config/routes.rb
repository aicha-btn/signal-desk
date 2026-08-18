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
        resources :feedbacks, only: %i[index create show update destroy] do
          resources :comments, only: %i[index create destroy]
          resources :activity_events, only: :index
        end
        resources :customers, only: %i[index create show update destroy]
        resources :members, only: :index
        resources :invitations, only: %i[index create destroy]
        resources :tags, only: %i[index create update destroy]
      end
      resources :invitations, only: :show, param: :token do
        post :accept, on: :member
      end
      namespace :public do
        get "forms/:slug", to: "forms#show"
        post "forms/:slug/feedbacks", to: "forms#create"
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
