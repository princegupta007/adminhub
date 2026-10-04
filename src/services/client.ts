const DEFAULT_BASE_URL = "https://dummyjson.com";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly endpoint: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? DEFAULT_BASE_URL;
}

interface ApiGetOptions {
  params?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
}

/**
 * Thin typed fetch wrapper around the public REST API.
 * All service-layer calls funnel through here so error handling,
 * base-url handling and query-string building stay in one place.
 */
export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
  const { params, signal } = options;
  const url = new URL(`${getBaseUrl()}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError(
      "Network error — please check your connection and try again.",
      0,
      path,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      path,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("Received an invalid response from the server.", 0, path);
  }
}
