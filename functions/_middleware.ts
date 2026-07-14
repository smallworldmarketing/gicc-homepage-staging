type PagesContext = {
  request: Request;
  next(): Promise<Response>;
};

const GONE_PATHS = new Set([
  "/classic-1/",
  "/test-page/",
  "/eid-al-fitr-2022-announcement/",
  "/1st-annual-quran-competition-results/",
  "/eid-al-adha-salaah-and-festival/",
  "/category/uncategorized/",
  "/author/giccadmin/",
  "/author/partopia/",
]);

export const onRequest = async ({ request, next }: PagesContext) => {
  const pathname = new URL(request.url).pathname;
  if (!GONE_PATHS.has(pathname)) return next();

  return new Response(
    "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><meta name=\"robots\" content=\"noindex\"><title>Content retired | GICC</title><body><main><h1>This content has been retired</h1><p>This expired announcement or test page was removed during the GICC website migration.</p><p><a href=\"/\">Visit the current GICC website</a></p></main></body></html>",
    {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
};
