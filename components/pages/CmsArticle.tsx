import Link from "next/link";
import { mediaUrl } from "@/lib/media";
import { sanitizeContent } from "@/lib/sanitize";
import type { CmsPageRecord, RelatedPage } from "@/lib/types";
import { site } from "@/lib/site";

export function CmsArticle({
  page,
  related,
  publicPrefix,
  template,
}: {
  page: CmsPageRecord;
  related: RelatedPage[];
  publicPrefix: string;
  template: string;
}) {
  const image = mediaUrl(page.image);
  const html = sanitizeContent(page.content);
  const isAffiliations = publicPrefix === "study-australia" && page.slug === "our-affiliations";

  return (
    <article className="bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-sg-light-blue">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/${publicPrefix}`} className="capitalize hover:text-sg-light-blue">
                {publicPrefix.replaceAll("-", " ")}
              </Link>
            </li>
            {page.slug !== page.category ? (
              <>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-gray-900">{page.title}</li>
              </>
            ) : null}
          </ol>
        </nav>

        <header className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white shadow-2xl">
          {image ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/55 via-blue-800/50 to-blue-700/55" />
          <div className="relative px-6 py-12 md:px-12 md:py-16">
            <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">{page.title}</h1>
            {page.excerpt ? <p className="mt-4 max-w-2xl text-lg text-blue-100">{page.excerpt}</p> : null}
          </div>
        </header>

        {isAffiliations ? <AffiliationsIntro html={html} /> : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-8">
            {!isAffiliations && html ? (
              <section id="overview" className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">Overview</h2>
                <div className="cms-content" dangerouslySetInnerHTML={{ __html: html }} />
              </section>
            ) : null}
            <VisaBlocks page={page} />
            {template === "study-australia" && !isAffiliations ? <StudyFeatures /> : null}
            <HelpCard />
            {related.length > 0 ? (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Related pages</h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link href={item.href} className="block rounded-xl border bg-white p-4 hover:border-sg-light-blue">
                        <span className="font-semibold text-sg-navy">{item.title}</span>
                        {item.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item.excerpt}</p> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <SidebarHelp />
          </aside>
        </div>
      </div>
    </article>
  );
}

function AffiliationsIntro({ html }: { html: string }) {
  return (
    <section className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">Trusted Affiliations</p>
      <h2 className="mt-2 text-3xl font-bold text-sg-navy">Partners Who Power Our Success</h2>
      <div className="mt-6 grid gap-6 text-lg leading-relaxed text-sg-dark-gray lg:grid-cols-2">
        <p>
          Bansal Immigration is proud to be registered and affiliated with leading professional and government
          organizations that uphold the highest standards in immigration and international education services.
        </p>
        <p>
          These partnerships ensure that every student and migrant we assist benefits from credible advice, ethical
          practices, and direct access to Australia’s most reputable institutions.
        </p>
      </div>
      {html ? <div className="cms-content mt-8" dangerouslySetInnerHTML={{ __html: html }} /> : null}
    </section>
  );
}

function StudyFeatures() {
  const items = [
    ["World-Class Education", "Access to top-ranked universities and vocational institutions with globally recognized qualifications.", "bg-blue-50 text-blue-900"],
    ["Work Opportunities", "Part-time work rights during studies and post-study work visa opportunities.", "bg-green-50 text-green-900"],
    ["Pathway to PR", "Study in Australia can provide pathways to permanent residency and citizenship.", "bg-purple-50 text-purple-900"],
    ["Quality of Life", "Experience high quality of life in one of the world's most liveable countries.", "bg-orange-50 text-orange-900"],
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map(([title, copy, tone]) => (
        <section key={title} className={`rounded-lg border p-6 ${tone}`}>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2">{copy}</p>
        </section>
      ))}
    </div>
  );
}

function VisaBlocks({ page }: { page: CmsPageRecord }) {
  const eligibility = page.visaEligibility.filter(Boolean);
  const midpoint = Math.ceil(eligibility.length / 2);
  return (
    <>
      {eligibility.length > 0 ? (
        <section id="eligibility" className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Do You Have What It Takes?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[eligibility.slice(0, midpoint), eligibility.slice(midpoint)].map((column, index) => (
              <ul key={index} className="space-y-2 text-sm text-gray-700">
                {column.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-600">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>
      ) : null}
      {page.visaBenefits.filter(Boolean).length > 0 ? (
        <section id="benefits" className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Why Choose This Path?</h2>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            {page.visaBenefits.filter(Boolean).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {page.visaSteps.filter(Boolean).length > 0 ? (
        <section id="how-to-apply" className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Your Roadmap to Success</h2>
          <ol className="list-decimal space-y-2 pl-5 text-gray-700">
            {page.visaSteps.filter(Boolean).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      ) : null}
      {page.visaDuration.initial || page.visaDuration.extension || page.visaDuration.permanent || page.visaDuration.notes ? (
        <section id="duration" className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Visa Duration</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {page.visaDuration.initial ? <DurationItem label="Initial Duration" value={page.visaDuration.initial} /> : null}
            {page.visaDuration.extension ? <DurationItem label="Extension Duration" value={page.visaDuration.extension} /> : null}
            {page.visaDuration.permanent ? <DurationItem label="Permanent Residency" value={page.visaDuration.permanent} /> : null}
            {page.visaDuration.notes ? <DurationItem label="Additional Notes" value={page.visaDuration.notes} /> : null}
          </div>
        </section>
      ) : null}
      {page.visaPathways.some((item) => item.title) ? (
        <section id="pathways" className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Visa Pathways</h2>
          <div className="space-y-6">
            {page.visaPathways
              .filter((item) => item.title)
              .map((item) => (
                <div key={item.title} className="rounded-lg border p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  {item.description ? <p className="mt-2 text-gray-600">{item.description}</p> : null}
                  {item.requirements ? (
                    <p className="mt-3 whitespace-pre-line text-sm text-gray-600">{item.requirements}</p>
                  ) : null}
                  {item.steps && item.steps.filter((step) => step.trim()).length > 0 ? (
                    <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-gray-600">
                      {item.steps.filter((step) => step.trim()).map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              ))}
          </div>
        </section>
      ) : null}
      {page.visaProcessing.standard || page.visaProcessing.priority || page.visaProcessing.complex ? (
        <section id="processing-times" className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Processing times</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {page.visaProcessing.standard ? <Stat label="Standard" value={page.visaProcessing.standard} /> : null}
            {page.visaProcessing.priority ? <Stat label="Priority" value={page.visaProcessing.priority} /> : null}
            {page.visaProcessing.complex ? <Stat label="Complex cases" value={page.visaProcessing.complex} /> : null}
          </div>
        </section>
      ) : null}
      {page.visaCosts.some((row) => row.label || row.amount) ? (
        <section id="costs" className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Costs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-left">
              <caption className="sr-only">Visa costs</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2">Item</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {page.visaCosts
                  .filter((row) => row.label || row.amount)
                  .map((row) => (
                    <tr key={`${row.label}-${row.amount}`}>
                      <td className="border px-4 py-2">{row.label}</td>
                      <td className="border px-4 py-2">{row.amount}</td>
                      <td className="border px-4 py-2">{row.notes}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
      {page.visaFaqs.some((faq) => faq.question && faq.answer) ? (
        <section id="faqs">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Got Questions? We&apos;ve Got Answers</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {page.visaFaqs
              .filter((faq) => faq.question && faq.answer)
              .map((faq) => (
                <div key={faq.question} className="rounded-2xl bg-white p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-3 whitespace-pre-line text-gray-700">{faq.answer}</p>
                </div>
              ))}
          </div>
        </section>
      ) : null}
      {page.visaHighlights.filter(Boolean).length > 0 ? (
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Highlights</h2>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            {page.visaHighlights.filter(Boolean).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

function DurationItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900">{label}</h3>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function SidebarHelp() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
        <h2 className="text-xl font-bold">Get Expert Help</h2>
        <p className="text-xs uppercase tracking-wide text-white/90">Registered Migration Agents</p>
      </div>
      <div className="space-y-3 p-6">
        <a href={site.phoneTel} className="block rounded-xl bg-green-50 p-4 font-bold text-gray-900">
          {site.phoneDisplay}
        </a>
        <a href={`mailto:${site.email}`} className="block rounded-xl bg-blue-50 p-4 text-sm font-bold text-gray-900">
          {site.email}
        </a>
        <Link href="/book-an-appointment" className="block rounded-xl bg-sg-light-blue py-3 text-center font-bold text-white">
          Book a Consultation
        </Link>
        <Link href="/contact" className="block rounded-xl border-2 border-sg-light-blue py-3 text-center font-bold text-sg-light-blue">
          Talk to Our Team
        </Link>
      </div>
    </div>
  );
}

function HelpCard() {
  return (
    <section className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 text-white">
      <h2 className="text-xl font-semibold">Prefer to Talk Directly?</h2>
      <p className="mt-2">Book a free consultation or call us for immediate assistance.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link href="/book-an-appointment" className="rounded bg-white px-6 py-2 text-center font-medium text-yellow-600">
          Book Free Consultation
        </Link>
        <Link href="/contact" className="rounded border border-white px-6 py-2 text-center">
          View Contact Info
        </Link>
      </div>
    </section>
  );
}
