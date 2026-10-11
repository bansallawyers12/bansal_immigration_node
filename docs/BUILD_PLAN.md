# Bansal Immigration — Node build plan

Follow this file in order. Each phase has a goal, the Laravel source to copy behaviour from, the work, and a check that says the phase is done.

The Laravel site at `c:\xampp\htdocs\bansal_immigration_new` (GitHub `bansallawyers12/bansal_immigration_new`) is the reference. This repository (`bansallawyers12/bansal_immigration_node`) is the new site. Do not change the Laravel repo while building here.

## How the Laravel site actually works

Most visa URLs are not separate hand-written pages. A route loads one row from the `pages` table and renders it with a category template.

- `routes/visa-routes.php` declares the public paths.
- `PageController::show()` loads `pages` where `category`, `slug`, and `status` match.
- The row’s `template` picks a Blade file under `resources/views/pages/`. If it is empty, the category default is used (`study-australia`, `visitor-visa`, `migrate-to-australia`, `skilled-migration`, `family-visa`, `employer-sponsored`, `business-visa`, `appeals`, `citizenship`, `skill-assessment`, and `pages.default` for the smaller hubs).
- Body copy, SEO fields, and structured visa blocks (`visa_highlights`, `visa_eligibility`, `visa_benefits`, `visa_steps`, `visa_faqs`, `visa_processing_times`, `visa_costs`, `visa_duration`, `visa_pathways`) live in MySQL.
- A few hubs ignore the database and use a fixed view: citizenship index, other-countries index, and celebrity visas.
- Home, blog, success stories, team, and services also read MySQL (`home_content`, `blogs`, `success_stories`, `team_members`, `services`).
- Contact, office visit, appointments, police checks, and the education landing page write to MySQL and send email.

Build the Node site the same way: one renderer per template, content from the existing database. Do not create one React file per visa URL.

`routes/Bkkl13Dec2025web.php` and `routes/Bkkl13Dec2025appointment-routes.php` are old copies. Ignore them.

## Already done

The Next.js 16 shell is on `main`.

- App Router, TypeScript, Tailwind 4
- Header, footer, home page, and “page not built yet” for other addresses
- Top-level URL list in `lib/public-routes.ts`
- Site name, phone, email, and Melbourne address in `lib/site.ts`

## Rules for every phase

- Keep the current public URL. Search rankings depend on it.
- Read and write the existing MySQL tables. Do not invent a second content database.
- Publish only rows with the same active/status rules Laravel uses.
- Leave Laravel admin running until a later phase replaces it. Editors keep using it, and the Node site shows the saved rows.
- Copy wording, form labels, consent text, and images from the Laravel views. Do not rewrite marketing copy.
- Secrets stay in `.env.local`. Never commit them. `.env.example` lists names only.
- After each phase: `npm run lint`, `npm run typecheck`, `npm run build`, then click through the new pages in the browser.

## Target layout

```text
app/                      routes and pages
components/layout/        header, footer, shared chrome
components/pages/         one component per Blade template
components/forms/         contact, office visit, landing, police checks
components/booking/       appointment wizard
lib/db.ts                 mysql2 pool
lib/pages.ts              load pages, blogs, stories
lib/mail.ts               Nodemailer
lib/public-routes.ts      nav and route list
public/                   images copied from the Laravel public folder
```

Stack, matching this repo and the lawyers site where it fits: Next.js 16, React 19, TypeScript, Tailwind 4, `mysql2`, Nodemailer, Stripe.

## Database tables this site uses

| Table | Used for |
| --- | --- |
| `pages` | Visa and CMS pages |
| `home_content` | Home SEO and a few home settings |
| `services` | Home service list |
| `blogs`, `blog_categories` | Blog |
| `success_stories` | Success stories |
| `team_members` | Team page |
| `sliders` | Home slider, if still active |
| `contacts` | Contact and landing enquiries |
| `newsletter_subscriptions` | Newsletter |
| `office_visit_forms` | Office visit form |
| `lp_enquiries` | Education landing enquiries, if present |
| `enhanced_appointments` | Bookings (Laravel model `Appointment`) |
| `blocked_times` | Unavailable slots |
| `calendar_settings` | Locations, hours, slot length, enquiry lanes |
| `payments` | Stripe payments |
| `promo_codes` | Appointment discounts |
| `afp_applications` | AFP police check |
| `indian_police_applications` | Indian police check |
| `anzsco_occupations` | Occupation finder |
| `suburbs`, `postcode_ranges` | Postcode checker |
| `users`, `personal_access_tokens` | Admin login and CRM API |

Confirm the live table name for appointments before coding. The model is `Appointment`; the migration comments say the old `appointments` table was replaced by `enhanced_appointments`.

---

## Phase 1 — Foundation

Goal: the app can read the live content database and share one visual frame.

Laravel source: `config/database.php`, `.env.example`, `resources/views/layouts/main.blade.php`, `resources/views/components/header.blade.php`, `resources/views/components/footer.blade.php`, `resources/css/`.

Work:

- [ ] Add `lib/db.ts` with a server-only MySQL pool. Connection values come from `.env.local`.
- [ ] Add read helpers that return published pages, blogs, and success stories.
- [ ] Copy public images from the Laravel `public/img` and `public/assets` folders into this `public/` folder. Skip `public/build`.
- [ ] Match header and footer to the current site: primary menu, Book Consultation, phone, email, Melbourne address, service links, company links, legal links.
- [ ] Bring across the current colours, logo, and favicon. The shell uses plain slate until this step.
- [ ] Add skip link, page title template, and Open Graph defaults from `layouts/main.blade.php`.

Done when: the home page shows the real logo and navigation, and a server function can print one published page title from MySQL.

## Phase 2 — Shared page renderer

Goal: any active `pages` row can render at its real URL.

Laravel source: `app/Http/Controllers/PageController.php`, `app/Models/Page.php`, `resources/views/pages/default.blade.php`, `app/Services/ContentSanitizer.php`.

Work:

- [ ] Map `category` + `slug` to `/category` or `/category/slug`. The index row is the one whose slug equals the category, or the first active top-level row.
- [ ] Return 404 when the slug equals the category (`/study-australia/study-australia` is invalid).
- [ ] Render stored HTML only after the same cleaning `ContentSanitizer` does. Do not use unsanitised `dangerouslySetInnerHTML`.
- [ ] Render the structured visa blocks: highlights, eligibility, benefits, steps, FAQs, processing times, costs, duration, pathways.
- [ ] Set `title` and `description` from `meta_title` and `meta_description`, with the same “| Bansal Immigration” rule as `Page::` title handling.
- [ ] Show up to six related pages in the same category.

Done when: one known visa URL, loaded from the database, matches the Laravel page’s title, headings, and main copy.

## Phase 3 — Category templates

Goal: each category uses the same layout family as Laravel, then every child URL in that category works through the renderer.

Build a template, then turn on that category’s routes. Child URLs below come from `routes/visa-routes.php`.

### Study in Australia — `pages/study-australia.blade.php`

- [ ] `/study-australia`
- [ ] `/study-australia/admission-in-australia`
- [ ] `/study-australia/new-coe`
- [ ] `/study-australia/course-change-in-australia`
- [ ] `/study-australia/what-is-recognized-prior-learning-rpl-australia`
- [ ] `/study-australia/professional-year-program`
- [ ] `/study-australia/request-to-defer-your-studies`
- [ ] `/study-australia/our-affiliations` (forced to the study layout)
- [ ] `/study-australia/student-dependent-visa-500`
- [ ] `/study-australia/student-visa-extension`
- [ ] `/study-australia/student-guardian-visa-590`
- [ ] `/study-australia/student-visa-journey`
- [ ] `/study-australia/student-subsequent-visa`
- [ ] `/study-australia/student-visa-information`

Calculator route is Phase 7. `/study-australia/apply-afp-ipc-form` redirects to the AFP form.

### Visitor visas — `pages/visitor-visa.blade.php`

- [ ] `/visitor-visa`
- [ ] `/visitor-visa/visitor-visa-600`
- [ ] `/visitor-visa/electronic-travel-authority-601`
- [ ] `/visitor-visa/evisitor-651`
- [ ] `/visitor-visa/onshore-visitor-visa-extension`
- [ ] `/visitor-visa/work-holiday-462`
- [ ] `/visitor-visa/work-holiday-417`
- [ ] `/visitor-visa/sponsored-family`

### Migrate to Australia — `pages/migrate-to-australia.blade.php`

The index is forced to the hub design even if the row’s template differs.

- [ ] `/migrate-to-australia`
- [ ] `/migrate-to-australia/how-to-claim-regional-points`
- [ ] `/migrate-to-australia/points-for-english-score`
- [ ] `/migrate-to-australia/national-innovation-visa-858`
- [ ] `/migrate-to-australia/global-talent-independent-program-gti`
- [ ] `/migrate-to-australia/distinguished-talent-visa-124`
- [ ] `/migrate-to-australia/distinguished-talent-visa-858`
- [ ] `/migrate-to-australia/migration`
- [ ] `/migrate-to-australia/skilled-migration`
- [ ] `/migrate-to-australia/temporary-graduate-visa-485`
- [ ] `/migrate-to-australia/temporary-graduate-visa-subclass-485`
- [ ] `/migrate-to-australia/post-study-work-visa-485`
- [ ] `/migrate-to-australia/post-study-work-visa-subclass-485`
- [ ] `/migrate-to-australia/skilled-recognised-graduate-visa-476`
- [ ] `/migrate-to-australia/skilled-recognised-graduate-visa-subclass-476`
- [ ] `/migrate-to-australia/skilled-independent-visa-189`
- [ ] `/migrate-to-australia/skilled-nominated-visa-190`
- [ ] `/migrate-to-australia/skilled-regional-visa-887`
- [ ] `/migrate-to-australia/skilled-work-regional-provisional-491`

PR calculator is Phase 7.

### Skilled migration — `pages/skilled-migration.blade.php`

- [ ] `/skilled-migration`
- [ ] `/skilled-migration/how-points-are-calculated`
- [ ] `/skilled-migration/temporary-graduate-visa-subclass-485-vocational`
- [ ] `/skilled-migration/temporary-graduate-visa-subclass-485-higher-education`
- [ ] `/skilled-migration/temporary-graduate-visa-extension`
- [ ] `/skilled-migration/skilled-independent-visa-subclass-189`
- [ ] `/skilled-migration/skilled-nominated-visa-subclass-190`
- [ ] `/skilled-migration/skilled-regional-visa-subclass-887`
- [ ] `/skilled-migration/permanent-residence-skilled-regional-visa-subclass-191`
- [ ] `/skilled-migration/skilled-work-regional-provisional-491`

### Family visas — `pages/family-visa.blade.php`

- [ ] `/family-visa`
- [ ] Partner: 309, 100, 820, 801, 300, and New Zealand 461
- [ ] Parent: 884, 864, 173, 143, 103, 804, 870
- [ ] Child: 101, 802, adoption, dependent child
- [ ] Relative and carer: 115, 835, 117, 837, 114, 838, 116, 836
- [ ] `/family-visa/cost-for-contributory-visas`
- [ ] `/partner-visas` and `/parent-visas` hub pages (`partner-visas.blade.php`, `parent-visas.blade.php`)

### Employer sponsored — `pages/employer-sponsored.blade.php`

- [ ] `/employer-sponsored`
- [ ] `/employer-sponsored-visas` (legacy alias; keep the same destination Laravel uses)
- [ ] SID 482, old 482, current 482, DAMA, 494, 408, 407, 400
- [ ] ENS 186 TRT, ENS 186 direct, GTES
- [ ] Application process, standard business sponsorship, nomination process

### Business visas — `pages/business-visa.blade.php`

- [ ] `/business-visas`
- [ ] Subclass 888, 188, and 132

### Appeals — `pages/appeals.blade.php`

- [ ] `/appeals`
- [ ] ART, Federal Court, ministerial intervention, review process
- [ ] Visa refusal, visa cancellation, NOICC, waiver
- [ ] Work rights and study rights

### Citizenship

- [ ] `/citizenship` uses `citizenship-index.blade.php`, not a database page
- [ ] Conferral, descent, evidence, birth, dual citizenship
- [ ] `/citizenship/citizenship-test` uses `citizenship-test.blade.php` if that view is still the live one

### Skill assessment — `pages/skill-assessment.blade.php`

- [ ] `/skill-assessment`
- [ ] ACS, VETASSESS, Engineers Australia, accountant, nursing (Ahpra and ANMAC)
- [ ] Trades Recognition Australia, trades, Job Ready Program
- [ ] Guide, requirements, timeline

### Smaller hubs — `pages/default.blade.php` unless a dedicated view exists

- [ ] `/transit-special-purpose`
- [ ] `/medical-humanitarian`
- [ ] `/maritime-crew`
- [ ] `/bridging-return-visas` and `/bridging-return-visas/bridging-return-visas`
- [ ] `/other-countries`, `/other-countries/canada`, `/other-countries/new-zealand`, `/other-countries/usa`
- [ ] Other-countries index and celebrity visas use their dedicated Blade files, not the generic page row

### Design previews — do not publish

`/design/innovation-visa-test` and `/design/visa-structured-preview` are internal previews. Leave them out of the public site and out of the sitemap.

Done when: every URL in this phase returns the same title and main content as Laravel, and an unknown slug returns 404.

## Phase 4 — Home and company pages

Goal: the main marketing pages match the current site.

Laravel source: `HomeController`, `resources/views/index.blade.php`, `about`, `team`, `testimonials`, `why-choose`, `mission-vision`, and the legal views.

- [ ] `/` reads `home_content`, the latest three active blogs, active services, and featured success stories. Cache the data for one hour, the same window Laravel uses.
- [ ] `/about`
- [ ] `/team` and `/our-team` (same page)
- [ ] `/testimonials`
- [ ] `/why-choose-us` and `/why-choose` (same page)
- [ ] `/mission-vision`
- [ ] `/privacy-policy`, `/terms-conditions`, `/disclaimer`, `/cookie-policy`
- [ ] Structured data from the home layout: ProfessionalService and WebSite, Melbourne address, phone `+61 3 9602 1330`, email `info@bansalimmigration.com.au`.

Done when: home, about, team, and the four legal pages match the live site’s wording and links.

## Phase 5 — Blog and success stories

Laravel source: `HomeController` blog and success-story methods, `app/Models/Blog.php`, `app/Models/SuccessStory.php`.

- [ ] `/blogs` lists active posts, newest first.
- [ ] `/blogs/{slug}` shows one active post. Unknown or inactive slugs return 404.
- [ ] `/success-stories` and `/success-stories/{slug}` follow the same active-status rule.
- [ ] Featured flags and images come from the database.

Done when: the three latest home blogs link to working detail pages, and an inactive slug does not appear.

## Phase 6 — SEO files and redirects

Laravel source: `routes/web.php` sitemap, robots, and llms routes; `config/legacy-redirects.php` (159 entries); the 301 list at the bottom of `routes/web.php`.

- [ ] `/sitemap.xml` lists home, company pages, police-check pages, active CMS pages, active blogs, and active success stories. Cache it for one hour. Use the canonical host.
- [ ] `/robots.txt` blocks `/admin/`, `/admin-login`, `/dashboard`, `/api/`, `/landing`, and `/design/`. Staging and development disallow everything. Advertise the sitemap only on the production host.
- [ ] `/llms.txt` follows the same environment split.
- [ ] Port `config/legacy-redirects.php` as permanent redirects.
- [ ] Port the extra 301s in `routes/web.php`: `/our-team` aliases, old root visa URLs, WordPress `/public/*` and `/page/*`, `/wp-admin` as gone, and the named blog moves.
- [ ] `/occupation-finder` is a real page in Phase 7, not a redirect.

Done when: a sample of old URLs (at least `/about-us`, `/pr-calculator`, `/canada`, and one blog alias) land on the new paths, and the sitemap contains a live blog URL.

## Phase 7 — Tools

Laravel source: `resources/views/tools/`, `resources/js/pages/pr-point-calculator.js`, `student-visa-calculator.js`, `anzsco-search.js`, `postcode-checker.js`, `PostcodeController`, `PublicAnzscoController`.

- [ ] `/migrate-to-australia/pr-point-calculator`
- [ ] `/study-australia/student-visa-financial-calculator`
- [ ] `/occupation-finder` searching `anzsco_occupations`
- [ ] `/postcode-checker` plus `/api/postcode/check` and `/api/postcode/suggest`
- [ ] Keep the public calculator and search limits from `routes/api.php` where those endpoints stay public.

These tools calculate in the browser or from public tables. They do not create a customer record.

Done when: each tool accepts the same inputs as Laravel and shows the same result for one fixed example.

## Phase 8 — Lead forms

Laravel source: `ContactController`, `OfficeVisitFormController`, `LandingController`, `GoogleSheetsService`, `TurnstileVerifier`, mail classes `ContactUsMail` and `ContactForwardMail`.

- [ ] `/contact`, `POST /contact`, `POST /contact/submit`, `/contact-thank-you`
- [ ] `/office-visit-form`, submit, and thank-you page. Save `office_visit_forms`.
- [ ] `/lp`, `POST /lp/enquire`, `/lp-thankyou`. Append the enquiry to the Google Sheet when credentials exist.
- [ ] `/google-ads-landing` and `/landing` if those views are still in use.
- [ ] `/leads` only if that form is still linked from the live site.
- [ ] Newsletter `POST /api/home/newsletter` into `newsletter_subscriptions`.
- [ ] Cloudflare Turnstile when both keys are set. On localhost it stays off unless `TURNSTILE_ENABLE_ON_LOCAL` is true.
- [ ] Rate limits: contact 30/minute, newsletter 10/minute. Match Laravel’s field validation.
- [ ] Mail: Gmail SMTP for contact forwards. Do not log enquiry bodies.

Done when: a test submission is stored in the same table Laravel uses, the thank-you page shows, and a failed mail send does not claim success.

## Phase 9 — Appointments and payments

This is the largest behaviour change. Port it as a module, using the lawyers booking code only as a shape reference. The immigration rules are in Laravel.

Laravel source:

- `resources/views/bookappointment.blade.php`
- `resources/js/appointment-form/`
- `AppointmentController`, `PublicAppointmentActionController`
- `PublicAppointmentSlotService`, `PaymentService`, `CrmAppointmentPushService`
- `ClientAppointmentActionService`, `AppointmentActionNotificationService`
- `CalendarSetting`, `BlockedTime`, `PromoCode`
- Mail: confirmation, cancellation, reschedule, client-confirmed

Public pages and actions:

- [ ] `/book-an-appointment`
- [ ] `POST /appointments/book`
- [ ] `/appointment-thank-you`
- [ ] Slot APIs: available slots and blocked dates
- [ ] Public confirm, cancel, and reschedule under `/appointment/{id}/...`, limited to 20 requests per minute
- [ ] Payment page, create intent, process, success, cancel, and promo validation under `/payments`
- [ ] After book, reschedule, confirm, or cancel, POST to the Migration CRM webhook when `MIGRATION_CRM_WEBHOOK_URL` and token are set. A failed push must not fail the booking. The CRM’s 15-minute poll remains the backup.

Rules to preserve:

- [ ] Slot length, open hours, lunch, and days come from `calendar_settings`.
- [ ] Adelaide education and tourist enquiries share one calendar lane. Other Adelaide enquiries share the other lane. Appointment rows still store location `adelaide`.
- [ ] Melbourne tourist calendar keeps the current label from `CalendarSetting`.
- [ ] Blocked times remove slots.
- [ ] Promo codes honour active, expiry, and one-time-use flags.
- [ ] Currency is AUD.
- [ ] Appointment emails send from `noreply@bansalimmigration.com.au` through Zoho SMTP.
- [ ] Stripe keys stay server-side. The browser only receives the publishable key.

Done when: a test booking on a non-production calendar creates the row, blocks that slot, sends the confirmation path, and a second booking cannot take the same slot.

## Phase 10 — Police checks

Laravel source: `forms/afp-national-police-check.blade.php`, `forms/indian-police-check.blade.php`, both store controllers, `config/police-checks.php`, police-check mail classes.

- [ ] `/afp-national-police-check` GET and POST. Limit posts to 5 per minute.
- [ ] Store `afp_applications`, including uploaded documents, outside the public web root.
- [ ] `/indian-police-check` and `/indian-police-clearance` exist only when `INDIAN_PCC_ENABLED` is true. Otherwise those URLs are 404.
- [ ] Staff notification email on submit.
- [ ] Do not put identity documents in logs, the sitemap, or client-side storage.

Done when: a test AFP application saves, the file is downloadable only by an authorised admin path, and the public page cannot list other people’s applications.

## Phase 11 — CRM API

Laravel source: `routes/api.php` CRM group, `AppointmentApiController`, `OthersApiController`.

The Migration CRM already calls these Sanctum routes. Keep the same paths and JSON shapes so the CRM does not need a new contract.

- [ ] Appointments: list, export, recent, stats, scheduling reference, show, add, update, status, datetime helpers.
- [ ] Blogs: list and detail.
- [ ] PR calculator lists and result, student calculator lists and result.
- [ ] Occupation finder, all, and result.
- [ ] Postcode search, all, and result.
- [ ] Auth with the existing personal access tokens. Rate limit 60/minute.

Done when: one existing CRM token can read a recent appointment and the payload matches Laravel’s field names.

## Phase 12 — Admin

Do this last. Until then, staff keep using Laravel admin at `/admin`.

Laravel admin covers dashboard, contacts, office-visit forms, users, CMS pages, blogs, success stories, team order, blocked times, promo codes, visa field editing, calendar settings, police-check files, and appointment calendars.

Build it in Node only when the public site is already live and the Laravel admin is ready to be turned off. Public registration (`/register`) is Breeze scaffolding, not a customer feature. Do not offer public sign-up.

## Phase 13 — Cutover

- [ ] Point a staging host at this app, using a copy of the database or a read-only user plus a separate write database for form tests.
- [ ] Compare sitemap URLs with the Laravel sitemap.
- [ ] Check redirects, forms, one booking, and one AFP submission on staging.
- [ ] Check header and footer at 320, 768, and 1280 pixels.
- [ ] Switch production DNS only after those checks pass.
- [ ] Keep the Laravel app available until the CRM API and admin have a replacement.

## Environment names

Copy the names, not the values, from the Laravel `.env.example`.

| Name | Use |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | MySQL |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `ZOHO_MAIL_*`, `NOREPLY_MAIL_FROM_ADDRESS` | Appointment and police-check mail |
| `GMAIL_MAIL_*` | Contact forwards and password reset |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Form spam check |
| `STRIPE_KEY`, `STRIPE_SECRET` | Payments. Publishable key may be exposed. Secret may not. |
| `INDIAN_PCC_ENABLED` | Indian police-check pages |
| `GOOGLE_CREDENTIALS_PATH`, `GOOGLE_SHEETS_ID` | Landing-page sheet |
| `MIGRATION_CRM_WEBHOOK_URL`, `MIGRATION_CRM_WEBHOOK_TOKEN` | Instant appointment push |

## Explicitly out of the first public release

- Rebuilding Laravel admin
- Public user registration
- `/design/*` preview routes
- The December 2025 backup route files
- A new database schema
- Rewriting visa articles that already live in `pages.content`
