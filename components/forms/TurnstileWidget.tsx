"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onTurnstileLoad?: () => void;
    turnstileQueue?: Array<() => void>;
  }
}

export function TurnstileWidget({ siteKey }: { siteKey: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!siteKey) return;
    const container = containerRef.current;
    if (!container) return;
    let active = true;

    function render() {
      if (!active || !container || !window.turnstile || container.dataset.turnstileRendered === "true") return;
      try {
        const widgetId = window.turnstile.render(container, {
          sitekey: siteKey,
          theme: "light",
          callback() {
            setLoadError("");
          },
          "expired-callback"() {
            container.dataset.turnstileRendered = "false";
            delete container.dataset.turnstileWidgetId;
            container.innerHTML = "";
            render();
          },
          "error-callback"() {
            setLoadError("Security verification could not load. Please wait a moment or refresh the page.");
          },
        });
        container.dataset.turnstileRendered = "true";
        container.dataset.turnstileWidgetId = widgetId;
        setLoadError("");
      } catch {
        setLoadError("Security verification could not load. Please refresh the page and try again.");
      }
    }

    window.turnstileQueue = window.turnstileQueue || [];
    if (window.turnstile) {
      render();
    } else {
      window.turnstileQueue.push(render);
      if (!document.getElementById("cf-turnstile-script")) {
        window.onTurnstileLoad = () => {
          const queue = window.turnstileQueue?.slice() ?? [];
          window.turnstileQueue = [];
          queue.forEach((callback) => callback());
        };
        const script = document.createElement("script");
        script.id = "cf-turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      active = false;
    };
  }, [siteKey]);

  if (!siteKey) return null;

  return (
    <div>
      <div ref={containerRef} className="cf-turnstile" data-turnstile-widget="" />
      {loadError ? <p className="mt-2 text-sm text-red-700">{loadError}</p> : null}
    </div>
  );
}

export function resetTurnstile(form: HTMLFormElement) {
  const container = form.querySelector<HTMLElement>("[data-turnstile-widget]");
  const widgetId = container?.dataset.turnstileWidgetId;
  if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
}
