import { getContext } from "hono/context-storage";

export type Env = {
  Bindings: {
    API_TOKEN: string | undefined;
    BYU_API_TOKEN: string;
    TAILSCALE_API_KEY: string;
    TAILSCALE_TAILNET: string;
    ZZZ_COOKIE_STRING: string;
    ZZZ_UID: number;
  };
};

export const env = getContext<Env>;
