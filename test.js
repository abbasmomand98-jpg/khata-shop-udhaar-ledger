/* Khata — smoke tests. Run: node test.js
   Covers: shop totals, risk-band boundaries, search + band filters,
   payment maths, receipt numbering, reminder text, daily summary. */
var fs = require("fs");
var path = require("path");

var dataCode = fs.readFileSync(path.join(__dirname, "data.js"), "utf8");
var logicCode = fs.readFileSync(path.join(__dirname, "logic.js"), "utf8");
var scope = new Function(dataCode + "\n" + logicCode +
  "\nreturn { formatPKR: formatPKR, riskBand: riskBand, riskLabel: riskLabel, " +
  "findCustomer: findCustomer, filterCustomers: filterCustomers, " +
  "shopTotals: shopTotals, applyPayment: applyPayment, " +
  "makeReceiptNumber: makeReceiptNumber, nextReceiptNumber: nextReceiptNumber, " +
  "reminderText: reminderText, dailySummary: dailySummary, " +
  "CUSTOMERS: CUSTOMERS, SHOP: SHOP };")();

var total = 0, passed = 0;
function check(name, cond) {
  total++;
  if (cond) { passed++; console.log("PASS " + name); }
  else { console.log("FAIL " + name); }
}

// --- shop totals (must match the case-study mockups) ---
var t = scope.shopTotals(scope.CUSTOMERS);
check("10 sample customers", t.count === 10);
check("total outstanding = Rs 48,750", t.totalOutstanding === 48750);
check("overdue (30+) total = 28600", t.overdueTotal === 28600);
check("six cities covered", new Set(scope.CUSTOMERS.map(function (c) { return c.city; })).size === 6);
check("cities include Peshawar, Lahore, Karachi, Islamabad, Rawalpindi, Quetta",
  ["Peshawar", "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Quetta"].every(function (city) {
    return scope.CUSTOMERS.some(function (c) { return c.city === city; });
  }));
check("PKR formatting", scope.formatPKR(48750) === "Rs 48,750");

// --- risk bands ---
check("0 days = current", scope.riskBand(0) === "current");
check("29 days = current", scope.riskBand(29) === "current");
check("30 days = 30+ days", scope.riskBand(30) === "30+ days");
check("59 days = 30+ days", scope.riskBand(59) === "30+ days");
check("60 days = 60+ days", scope.riskBand(60) === "60+ days");
check("62 days label = HIGH RISK", scope.riskLabel(62) === "HIGH RISK");
check("41 days label = MEDIUM RISK", scope.riskLabel(41) === "MEDIUM RISK");
check("5 days label = CURRENT", scope.riskLabel(5) === "CURRENT");

// --- search + filters ---
check("search 'ahmed' = 1", scope.filterCustomers(scope.CUSTOMERS, "ahmed", "All").length === 1);
check("search city 'lahore' = 2", scope.filterCustomers(scope.CUSTOMERS, "lahore", "All").length === 2);
check("band 60+ days = 1", scope.filterCustomers(scope.CUSTOMERS, "", "60+ days").length === 1);
check("band 30+ days = 2", scope.filterCustomers(scope.CUSTOMERS, "", "30+ days").length === 2);
check("band current = 7", scope.filterCustomers(scope.CUSTOMERS, "", "current").length === 7);
check("search no match = 0", scope.filterCustomers(scope.CUSTOMERS, "zzz", "All").length === 0);
check("find KH-C01 = Ahmed", scope.findCustomer(scope.CUSTOMERS, "KH-C01").name === "Ahmed");
check("find unknown = null", scope.findCustomer(scope.CUSTOMERS, "KH-C99") === null);

// --- payments ---
var p = scope.applyPayment(12400, 2000);
check("partial payment: new balance 10400", p.ok && p.newBalance === 10400);
var full = scope.applyPayment(1200, 1200);
check("full payment: new balance 0", full.ok && full.newBalance === 0);
check("overpayment rejected", scope.applyPayment(1200, 1201).ok === false);
check("zero payment rejected", scope.applyPayment(1200, 0).ok === false);
check("negative payment rejected", scope.applyPayment(1200, -5).ok === false);
check("non-numeric rejected", scope.applyPayment(1200, "abc").ok === false);

// --- receipts + reminders ---
check("receipt format KH-2026-XXXX", /^KH-2026-\d{4}$/.test(scope.makeReceiptNumber(1042)));
check("next receipt after samples = 1043", scope.nextReceiptNumber(["KH-2026-1042", "KH-2026-1031"]) === "KH-2026-1043");
check("next receipt from empty = 0001", scope.nextReceiptNumber([]) === "KH-2026-0001");
var ahmed = scope.findCustomer(scope.CUSTOMERS, "KH-C01");
var rem = scope.reminderText(ahmed);
check("reminder names customer + balance", rem.indexOf("Ahmed") !== -1 && rem.indexOf("Rs 12,400") !== -1);
check("reminder names sample shop", rem.indexOf("Sample General Store") !== -1);
var sum = scope.dailySummary(scope.SHOP);
check("daily summary names Rs 4,600", sum.indexOf("Rs 4,600") !== -1);

console.log("\n" + passed + "/" + total + " smoke tests passed.");
process.exit(passed === total ? 0 : 1);
