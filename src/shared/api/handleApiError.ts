import axios from "axios";

interface ApiErrorPayload {
  detail?: string | Array<{ msg?: string }>;
}

export function handleApiError(error: unknown, fallback = "Ocurrió un error inesperado"): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail.trim().length > 0) {
      return detail;
    }
    if (Array.isArray(detail) && detail.length > 0) {
      const msgs = detail
        .map((item) => item.msg)
        .filter((msg): msg is string => Boolean(msg));
      if (msgs.length > 0) {
        return msgs.join(" | ");
      }
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}