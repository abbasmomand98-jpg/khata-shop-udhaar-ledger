# Khata — Digital Udhaar Ledger for Small Shops (UX Concept)

A working demo of a digital udhaar (credit) ledger for kiryana and general
stores in Pakistan. Shopkeepers who sell on credit to neighbours they trust
currently track everything in paper notebooks — pages tear, amounts are
disputed, and Rs 20,000–50,000 sits stuck per shop each month, with no
reminders and a cash crunch just as winter stock must be bought.

**Live demo:** https://abbasmomand98-jpg.github.io/khata-shop-udhaar-ledger/
**Repo:** https://github.com/abbasmomand98-jpg/khata-shop-udhaar-ledger

## Sample-data honesty note

Every shop, customer, amount, transaction and receipt in this demo is
invented sample data for demonstrating the design. No real person, shop or
phone number is shown, and no real customer data should ever be entered here.
Khata is an unofficial UX concept, not a real accounting app.

## How it works

Open `index.html` in any browser — no build step, no framework, just
HTML/CSS/JS. The demo has four pieces:

1. **Shop summary** — total udhaar outstanding across 10 sample customers
   (Rs 48,750), what was collected this month (Rs 31,200), and a daily
   collection summary (Rs 4,600 today, 3 payments, against a Rs 20,000 weekly
   target for winter stock).
2. **Customer ledger** — search by name, city or sample ID, and filter by
   overdue risk band: current (under 30 days), 30+ days, or 60+ days.
3. **Customer detail** — transaction history, a record-payment form, and a
   digital receipt number (KH-2026-XXXX) for every payment. Payments and
   receipts are saved in the browser's localStorage only — nothing leaves
   the device — and the demo can be reset with one button.
4. **Reminders** — overdue customers ranked by risk, with a polite,
   ready-to-copy reminder text in the shopkeeper's voice
   ("Assalam-o-Alaikum … please visit this week — JazakAllah!"). Khata
   generates the text; it never sends messages itself.

The logic lives in `logic.js` (pure functions, no DOM), the data in
`data.js`, and the wiring in `app.js` — so each file can be read on its own.

## What you can learn from this project

- **Derived state from one source of truth.** Balances, risk bands and shop
  totals are all computed from the customer list in `shopTotals`,
  `riskBand` and `filterCustomers` — change a balance and every total,
  flag and filter updates, because nothing is hard-coded twice.
- **Boundary-tested rules.** The risk bands (under 30 / 30–59 / 60+ days)
  and the payment guard (no zero, negative or over-balance payments) are
  exactly the kind of small rules that break in real apps — so they are
  covered by the smoke tests in `test.js` (run `node test.js`).
- **Local-first persistence without a backend.** Payments and receipts
  survive a page reload through localStorage, which is the simplest honest
  way to demo "saved on this device" before any server exists.
- **Designing for trust.** Money screens earn trust with proof: a receipt
  number for every payment, a visible sample-data label, and no field that
  asks for anything real. The same pattern fits any ledger, dues tracker or
  community savings app.

Fork it and adapt the pattern to your own local problem — a school fee
tracker, a workshop parts ledger, or a neighbourhood committee fund — and
keep the sample-data label wherever real people's money is involved.
