/** @module common/request */

import { retry, type RetryOptions } from "jsr:@std/async";

/** Client for JSON APIs. */
export class JsonClient {
  constructor(private url: string, private options: { token?: string }) {}

  /** Make a get request, and receive JSON data. */
  async get<T>(path: string): Promise<T> {
    const { response } = await request<T>(`${this.url}${path}`, {
      token: this.options.token,
      headers: {
        "Accept": "application/json; charset=UTF-8",
      },
    });
    return await response.json();
  }

  /** Make a post request with JSON data, and receive JSON data. */
  async post<T>(path: string, body: object): Promise<T> {
    const { response } = await request<T>(`${this.url}${path}`, {
      method: "POST",
      headers: {
        "Accept": "application/json; charset=UTF-8",
        "Content-Type": "application/json; charset=UTF-8",
      },
      body,
      token: this.options.token,
    });
    return await response.json();
  }

  /** Make a delete request and receive JSON data. */
  async delete<T>(path: string): Promise<T> {
    const { response } = await request<T>(`${this.url}${path}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json; charset=UTF-8",
      },
      token: this.options.token,
    });
    return await response.json();
  }
}

const TOO_MANY_REQUESTS = 429;

type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
interface RequestOptions {
  allowedErrors?: string[];
  body?: string | object;
  method?: RequestMethod;
  headers?: Record<string, string>;
  retry?: RetryOptions;
  token?: string;
  userAgent?: string;
}

export class RequestError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "RequestError";
  }
}

/** Makes an HTTP request, with retries on 429. */
async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<{
  response: Response;
  error?: { type: string; message: string };
}> {
  const response = await retry(async () => {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        ...options.headers,
        ...(options.token
          ? { "Authorization": `Bearer ${options.token}` }
          : {}),
        "User-Agent": options.userAgent ??
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Safari/605.1.15",
      },
      body: options.body
        ? (typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body))
        : undefined,
    });
    if (response.status === TOO_MANY_REQUESTS) {
      await response.body?.cancel();
      throw new Error("Too many requests");
    }
    return response;
  }, options.retry);

  if (!response.ok) {
    const error = await getErrorFromResponse(response);
    if (options.allowedErrors?.includes(error.type)) {
      return { response, error };
    }
    throw new RequestError(`${error.message} [${error.type}]`);
  }

  return { response };
}

async function getErrorFromResponse(
  response: Response,
): Promise<{ type: string; message: string }> {
  const text = await response.text();
  try {
    const { error } = JSON.parse(text) as {
      error: { type: string; message: string };
    };
    return error;
  } catch {
    return {
      type: response.status.toString(),
      message: response.statusText,
    };
  }
}
