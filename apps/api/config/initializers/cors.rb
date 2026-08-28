allowed_origins = [ ENV["APP_URL"], "https://signal-desk-lake.vercel.app" ].compact
allowed_origins.map! { |origin| origin.delete_suffix("/") }
unless Rails.env.production?
  allowed_origins.concat([
    %r{\Ahttp://localhost:\d+\z},
    %r{\Ahttp://127\.0\.0\.1:\d+\z}
  ])
end
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
