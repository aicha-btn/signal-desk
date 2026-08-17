class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_FROM", "SignalDesk <onboarding@resend.dev>")
  layout "mailer"
end
