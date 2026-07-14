# Redirects and Retired URLs

Cloudflare Pages redirects live in `public/_redirects`.

| Old URL | New handling | Reason |
|---|---|---|
| `/about-us/` | `301 /about/` | Same page, cleaner URL |
| `/contact-us/` | `301 /contact/` | Same page, cleaner URL |
| `/privacy-policy/` | `301 /privacy/` | Updated policy |
| `/donation/` | `301 /donate/` | Duplicate donation page |
| `/monthly-prayer-times/` | `301 /#prayer-times` | Live prayer section and monthly source |
| `/iqama-times/` | `301 /#prayer-times` | Live prayer section |
| `/mfas/` | `302` to MFAS enrollment | Registration is hosted by MFAS/Jotform |
| `/mfas-terms/` | Retained | Legal/program content |
| `/new-masjid/` | Retained | Active campaign page |
| `/youth-mental-health-support/` | Retained | Active support resource |
| `/classic-1/` | `410 Gone` | Empty theme/template artifact |
| `/test-page/` | `410 Gone` | Published WordPress test page |
| Three expired Eid/Quran posts | `410 Gone` | Expired or privacy-sensitive archive content |
| Author/category archives | `410 Gone` | No continuing editorial value |

Add specific rules above broad rules. Never redirect unrelated URLs to the homepage.
