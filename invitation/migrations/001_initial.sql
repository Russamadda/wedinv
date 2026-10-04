CREATE TABLE IF NOT EXISTS invitations (
 id uuid PRIMARY KEY,
 token_hash text UNIQUE NOT NULL,
 document jsonb NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS request_limits (
 key text PRIMARY KEY,
 window_start bigint NOT NULL,
 hits integer NOT NULL
);
-- Use a dedicated non-superuser application role. Never expose this connection to browsers.
REVOKE ALL ON invitations, request_limits FROM PUBLIC;
