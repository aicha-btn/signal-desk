require "net/http"

class SupabaseJwtVerifier
  class AuthenticationError < StandardError; end

  CACHE_KEY = "supabase/jwks".freeze

  class << self
    def verify(token)
      new.verify(token)
    end
  end

  def verify(token)
    payload, = JWT.decode(
      token,
      nil,
      true,
      algorithms: [ algorithm ],
      audience: audience,
      verify_aud: true,
      issuer: issuer,
      verify_iss: true,
      jwks: method(:jwks_loader)
    )

    raise AuthenticationError, "Token subject is missing" if payload["sub"].blank?
    raise AuthenticationError, "Token email is missing" if payload["email"].blank?

    payload
  rescue JWT::DecodeError, JSON::ParserError, KeyError, TypeError => error
    raise AuthenticationError, error.message
  end

  private

  def jwks_loader(options)
    fetch_jwks(force: options[:kid_not_found])
  end

  def fetch_jwks(force: false)
    Rails.cache.fetch(CACHE_KEY, expires_in: 5.minutes, force: force) do
      response = Net::HTTP.start(jwks_uri.host, jwks_uri.port, use_ssl: jwks_uri.scheme == "https") do |http|
        http.open_timeout = 3
        http.read_timeout = 3
        http.get(jwks_uri.request_uri)
      end

      raise AuthenticationError, "Unable to load signing keys" unless response.is_a?(Net::HTTPSuccess)

      JSON.parse(response.body)
    end
  rescue SocketError, SystemCallError, Timeout::Error => error
    raise AuthenticationError, error.message
  end

  def jwks_uri
    @jwks_uri ||= URI("#{supabase_url}/auth/v1/.well-known/jwks.json")
  end

  def issuer
    ENV.fetch("SUPABASE_JWT_ISSUER", "#{supabase_url}/auth/v1")
  end

  def audience
    ENV.fetch("SUPABASE_JWT_AUDIENCE", "authenticated")
  end

  def algorithm
    ENV.fetch("SUPABASE_JWT_ALGORITHM", "ES256")
  end

  def supabase_url
    ENV.fetch("SUPABASE_URL", "http://127.0.0.1:54321").delete_suffix("/")
  end
end
