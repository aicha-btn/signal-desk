allowed_origins = [ ENV.fetch("APP_URL", "http://localhost:3000") ]
allowed_origins.concat([ "http://localhost:3000", "http://127.0.0.1:3000" ]) unless Rails.env.production?

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)

    resource "/api/v1/public/*",
      headers: [ "Content-Type" ],
      methods: %i[get post options],
      max_age: 600
  end
end
