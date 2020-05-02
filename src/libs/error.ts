import * as Sentry from "@sentry/browser";

const isLocal = process.env.NODE_ENV === "development";

export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({ dsn: "https://f3a2a8c68c8942228189992e87430ead@o303154.ingest.sentry.io/5221399" });
}

export function logError(error: any, errorInfo = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope((scope: any) => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

export function onError(error: any) {
  let errorInfo: any = {};
  let message = error.toString();

  // Auth errors
  if (!(error instanceof Error) && error.message) {
    errorInfo = error;
    message = error.message;
    error = new Error(message);
    // API errors
  } else if (error.config && error.config.url) {
    errorInfo.url = error.config.url;
  }

  logError(error, errorInfo);

  alert(message);
}
