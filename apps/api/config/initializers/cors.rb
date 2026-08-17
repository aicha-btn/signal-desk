allowed_origins = [ ENV["APP_URL"], "https://signal-desk-lake.vercel.app" ].compact
allowed_origins.map! { |origin| origin.delete_suffix("/") }
allowed_origins.concat([ "http://localhost:3000", "http://127.0.0.1:3000" ]) unless Rails.env.production?
allowed_origins.uniq!

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)

    resource "/api/v1/public/*",
      headers: [ "Content-Type" ],
      methods: %i[get post options],
      max_age: 600
  end
end
