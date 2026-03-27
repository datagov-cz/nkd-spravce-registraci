// Load values from .env file and put them into process.env.
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const ConfigurationSchema = z.object({
  /**
   * True when in a development mode.
   */
  development: z.boolean(),
  /**
   * Configuration of authentication.
   */
  authentication: z.object({
    /**
     * When true use mock authentication.
     * This is available only for development,
     * do not use in a production.
     */
    useMock: z.boolean()

  }),
  forms: z.object({
    /**
     * URL of the dcat-ap-forms service, see
     * https://github.com/datagov-cz/nkd-formulare .
     *
     * Must not end with '/'.
     */
    proxyUrl: z.url(),
  }),
  /**
   * Configuration of this service HTTP interface.
   */
  http: z.object({
    /**
     * Port for the HTTP server to listen on.
     */
    port: z.number().positive(),
    /**
     * IP address for the HTTP server.
     */
    host: z.ipv4(),
    /**
     * Name of cookie to send to the user.
     */
    cookieName: z.string(),
    /**
     * A secret with minimum length of 32 characters.
     * We use this to sign the cookies.
     */
    cookiesSecret: z.string(),
    /**
     * Public base URL.
     */
    baseUrl: z.string(),
  }),
  isds: z.object({
    /**
     * Path to directory with ISDS messages.
     */
    messagesPath: z.string(),
    /**
     * Path to directory with ISDS attachments.
     */
    attachmentsPath: z.string(),
  }),
  repository: z.object({
    /**
     * Path to directory with repository messages.
     */
    messagesPath: z.string(),
    /**
     * Path to directory with repository attachments.
     */
    attachmentsPath: z.string(),
  }),
  rpp: z.object({
    /**
     * Path to RPP SPARQL endpoint.
     */
    sparql: z.string(),
  }),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

const createConfiguration = (): Configuration => {
  const env = process.env;
  return ConfigurationSchema.parse({
    development: env.NODE_ENV === "development",
    authentication: {
      useMock: env.AUTHENTICATION_USE_MOCK_DANGER === "yes",
    },
    forms: {
      proxyUrl: env.FORMS_URL,
    },
    http: {
      port: Number(env.HTTP_PORT),
      host: env.HTTP_HOST,
      cookieName: "nkod-registration-manager",
      cookiesSecret: env.HTTP_COOKIE_SECRET,
      baseUrl: env.HTTP_BASE_URL,
    },
    isds: {
      messagesPath: resolvePath(env.ISDS_MESSAGES),
      attachmentsPath: resolvePath(env.ISDS_ATTACHMENTS),
    },
    repository: {
      messagesPath: resolvePath(env.REPOSITORY_MESSAGES),
      attachmentsPath: resolvePath(env.REPOSITORY_ATTACHMENTS),
    },
    rpp: {
      sparql: "https://rpp-opendata.egon.gov.cz/odrpp/sparql",
    },
  });
};

function resolvePath(path: string | undefined): string | undefined {
  // We need to go from source directory.
  return path === undefined ? undefined : resolve(__dirname, "..", path);
}

export const configuration = createConfiguration();
