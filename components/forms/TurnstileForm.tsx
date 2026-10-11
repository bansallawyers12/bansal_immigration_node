import { Suspense, type ComponentType } from "react";
import { turnstileSiteKey } from "@/lib/turnstile";

export function TurnstileForm({ form: Form }: { form: ComponentType<{ siteKey: string | null }> }) {
  return (
    <Suspense fallback={<p className="mt-8 text-sm text-sg-medium-gray">Loading form…</p>}>
      <KeyedForm form={Form} />
    </Suspense>
  );
}

async function KeyedForm({ form: Form }: { form: ComponentType<{ siteKey: string | null }> }) {
  const siteKey = await turnstileSiteKey();
  return <Form siteKey={siteKey} />;
}
