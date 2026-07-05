# KRYONIS Forms Worker — paigaldus (5 min)

1. Cloudflare Dashboard → Workers & Pages → Create Worker → nimi `kryonis-forms` → Deploy.
2. Ava Edit code, kustuta näidiskood, kleebi `worker.js` sisu → Save and deploy.
3. Settings → Variables and Secrets → Add → Secret → nimi `RESEND_API_KEY`, väärtus Resendi API võti → Save.
4. Resend → Domains: veendu, et `kryonis.global` on verified.
5. Kopeeri Workeri URL (kryonis-forms.khorasystems.workers.dev).
6. script.js reale 6: const KRYONIS_FORM_ENDPOINT = 'https://kryonis-forms.khorasystems.workers.dev';
7. Commit + push. Valmis.

Kontroll: kryonis.global/commissions.html → täida vorm → Send. Kiri peab jõudma hq@kryonis.global postkasti.

Seni kuni endpoint on tühi, avab vorm varuvariandina e-kirja mustandi.

PAIGALDATUD: 05.07.2026 · Worker: kryonis-forms.khorasystems.workers.dev · Secret RESEND_API_KEY lisatud.
