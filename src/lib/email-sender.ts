// One sender for every Southern Legends email.
// matthewheadley.com is a verified Resend domain (DKIM). southernlegends.org and
// plainspokenblueprint.com are not — sending from them fails silently.
// tools/sl-email-lint.py checks every `from:` in src/app/api against this.
export const SL_FROM = "Matt Headley, Southern Legends <stories@matthewheadley.com>";
export const SL_REPLY_TO = "matt@gatherstudio.app";
export const SL_NOTIFY_TO = "matt@gatherstudio.app";
export const SL_SITE_URL = "https://southernlegends.org";
