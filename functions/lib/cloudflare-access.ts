interface AccessEnv {
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  STAFF_EMAIL_ALLOWLIST?: string;
}

interface AccessPayload {
  aud?: string | string[];
  email?: string;
  exp?: number;
  iss?: string;
  nbf?: number;
  sub?: string;
}

interface AccessHeader {
  alg?: string;
  kid?: string;
}

interface AccessJwk extends JsonWebKey {
  kid?: string;
}

interface JwksResponse {
  keys?: AccessJwk[];
}

export interface StaffIdentity {
  email: string;
  subject: string;
  csrfToken: string;
}

export type StaffAuthentication =
  | { ok: true; identity: StaffIdentity }
  | { ok: false; status: 401 | 403 | 503; message: string };

let jwksCache: { expiresAt: number; keys: AccessJwk[]; issuer: string } | undefined;

const normalizeTeamDomain = (value: string) => {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(withProtocol);
  if (url.protocol !== "https:") throw new Error("Cloudflare Access team domain must use HTTPS.");
  return url.origin;
};

const base64UrlBytes = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const decodeJson = <T>(value: string): T =>
  JSON.parse(new TextDecoder().decode(base64UrlBytes(value))) as T;

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const getJwks = async (issuer: string) => {
  if (jwksCache && jwksCache.issuer === issuer && jwksCache.expiresAt > Date.now()) return jwksCache.keys;

  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Cloudflare Access certificates returned ${response.status}.`);

  const body = await response.json() as JwksResponse;
  if (!Array.isArray(body.keys) || body.keys.length === 0) throw new Error("Cloudflare Access returned no signing keys.");

  jwksCache = {
    issuer,
    keys: body.keys,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
  return body.keys;
};

const configuredEmails = (value?: string) =>
  new Set((value ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));

export const authenticateStaff = async (request: Request, env: AccessEnv): Promise<StaffAuthentication> => {
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) {
    return { ok: false, status: 503, message: "Staff access has not been configured." };
  }

  const assertion = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!assertion || assertion.length > 16_384) {
    return { ok: false, status: 401, message: "Sign in through GICC staff access to continue." };
  }

  try {
    const segments = assertion.split(".");
    if (segments.length !== 3) throw new Error("Malformed Access assertion.");

    const [encodedHeader, encodedPayload, encodedSignature] = segments;
    const header = decodeJson<AccessHeader>(encodedHeader);
    const payload = decodeJson<AccessPayload>(encodedPayload);
    if (header.alg !== "RS256" || !header.kid) throw new Error("Unsupported Access assertion algorithm.");

    const issuer = normalizeTeamDomain(env.CF_ACCESS_TEAM_DOMAIN);
    if ((payload.iss ?? "").replace(/\/$/, "") !== issuer) throw new Error("Access assertion issuer mismatch.");

    const audiences = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
    if (!audiences.includes(env.CF_ACCESS_AUD)) throw new Error("Access assertion audience mismatch.");

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp <= now) throw new Error("Access assertion expired.");
    if (payload.nbf && payload.nbf > now + 60) throw new Error("Access assertion is not active yet.");
    if (!payload.email || !payload.sub) throw new Error("Access assertion has no staff identity.");

    const keys = await getJwks(issuer);
    const signingKey = keys.find((key) => key.kid === header.kid);
    if (!signingKey) throw new Error("Access assertion signing key was not found.");

    const publicKey = await crypto.subtle.importKey(
      "jwk",
      signingKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" },
      publicKey,
      base64UrlBytes(encodedSignature),
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    );
    if (!valid) throw new Error("Access assertion signature was invalid.");

    const email = payload.email.trim().toLowerCase();
    const allowlist = configuredEmails(env.STAFF_EMAIL_ALLOWLIST);
    if (allowlist.size > 0 && !allowlist.has(email)) {
      console.warn("staff_access_denied", { email });
      return { ok: false, status: 403, message: "This account is not authorized for the GICC request queue." };
    }

    return {
      ok: true,
      identity: {
        email,
        subject: payload.sub,
        csrfToken: await sha256Hex(`gicc-staff-request:${assertion}`),
      },
    };
  } catch (error) {
    console.error("staff_access_validation_failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return { ok: false, status: 401, message: "Your staff session is invalid or expired. Sign in again." };
  }
};
