# What is left

The Node site is not complete. The shell, shared page renderer, company pages, tools, basic forms, redirects, and a simple booking form are in place. Lint, typecheck, and `npm run build` pass.

Do not create a second content database. Keep using `bansal_immigration2`. Leave Laravel admin on until the last phase. Do not change the Laravel repo while finishing this one.

Work in this order. Each step has a check that says it is done.

## 1. Put the live content in this database

The code can render a visa page, but this database does not have the content. `pages` has two published rows: skilled migration and how points are calculated. `blogs`, `success_stories`, `services`, `home_content`, and `sliders` are empty. There is no `team_members` table.

Until those rows exist, `/visitor-visa`, `/study-australia`, and the other visa URLs correctly return 404.

Work:

- Restore or import the production `pages`, `blogs`, `success_stories`, `services`, `home_content`, and `sliders` into this same database. Do not invent a new schema.
- Add `team_members` only if production has that table. Match the production columns. The site already shows an empty team when the table is missing.
- Confirm a published row has `status = 1`.

Done when: `/visitor-visa`, `/study-australia`, one blog, and one success story return the same title and main copy as the Laravel site.

## 2. Match the category layouts

One shared article layout renders every CMS page. Laravel uses a different Blade file per category, plus fixed hubs for citizenship, other countries, celebrity visas, partner visas, and parent visas.

Work:

- Compare each category template in `resources/views/pages/` with `components/pages/CmsArticle.tsx` and the hub components.
- Port the celebrity visa gallery and the citizenship-test layout if those views are still live.
- Keep one renderer per template. Do not add one React file per visa URL.

Done when: a study page, a visitor page, the citizenship hub, and the celebrity page match the Laravel layout for the same row.

## 3. Finish the public tools

Occupation search and the postcode checker read the live tables. The PR and student calculators are simplified and have not been checked against the Laravel scripts.

Laravel source: `resources/js/pages/pr-point-calculator.js` and `student-visa-calculator.js`.

Work:

- Port the PR calculator inputs and scoring.
- Port the student calculator living-cost rules.
- Run one fixed example from the Laravel page and require the same total.

Done when: that example matches on both sites.

## 4. Finish lead capture

Contact, office visit, newsletter, and Turnstile are in place. These public pages are not:

- `/lp`, `POST /lp/enquire`, `/lp-thankyou`
- `/google-ads-landing` and `/landing`, if those Laravel views are still linked
- Google Sheets append when `GOOGLE_CREDENTIALS_PATH` and `GOOGLE_SHEETS_ID` are set
- The newsletter form on the home page. The API already exists.

Done when: a landing enquiry is stored, the thank-you page shows, and the sheet row appears when credentials exist.

## 5. Finish appointments and payments

A free booking can be saved in `enhanced_appointments`, and the slot rules for Adelaide lanes, ISO weekdays, lunch, and blocked times are in place. These are not:

- Blocked-dates API
- A transaction so two people cannot take the same slot
- Public confirm, cancel, and reschedule under `/appointment/{id}/...`, limited to 20 requests per minute
- Promo codes: active, expiry, and one-time use
- Stripe payment page, create intent, process, success, and cancel. Currency is AUD. The secret key stays on the server.
- Zoho mail for confirmation, cancellation, reschedule, and client-confirmed, from `noreply@bansalimmigration.com.au`
- CRM webhook after book, reschedule, confirm, or cancel. A failed push must not fail the booking.

Done when: a test booking on a non-production calendar creates the row, blocks that slot, a second booking cannot take it, and the payment and confirm paths match Laravel.

## 6. Finish police checks

The AFP form saves a row and stores files under `storage/afp`. Indian police-check URLs 404 unless `INDIAN_PCC_ENABLED=true`.

Still missing:

- Staff email on submit
- An authorised download path for the uploaded files. The public site must not list other people’s applications.
- The full Indian form when the flag is on. It is only a stub today.

Done when: a test AFP file can be downloaded only through that authorised path.

## 7. Finish the CRM API

Only `GET /api/crm/appointments/recent` exists. The Migration CRM calls the rest of Laravel’s Sanctum routes. Keep the same paths and JSON field names.

Still missing:

- Appointments: list, export, stats, scheduling reference, show, add, update, status, and datetime helpers
- Blogs: list and detail
- PR and student calculator lists and results
- Occupation finder: search, all, and result
- Postcode: search, all, and result
- The existing personal access tokens, limited to 60 requests per minute

Done when: one existing CRM token reads a recent appointment and the JSON matches Laravel.

## 8. Admin, then cutover

Do not build Node admin until the public site and the CRM API are live. Staff keep using Laravel `/admin`. Do not add public registration.

After that:

- Stage this app against a copy of the database.
- Compare sitemap URLs, redirects, one form, one booking, and one AFP submission.
- Check the header and footer at 320, 768, and 1280 pixels.
- Switch DNS only after those checks. Keep Laravel available until admin is replaced.
