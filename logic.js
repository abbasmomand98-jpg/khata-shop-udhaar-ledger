/* Khata — pure logic, no DOM. Safe to unit-test in Node. */

function formatPKR(n) {
  return "Rs " + Number(n).toLocaleString("en-PK");
}

/* Overdue risk bands: current (< 30 days), 30+ days, 60+ days. */
function riskBand(days) {
  days = Number(days);
  if (isNaN(days) || days < 0) { return "current"; }
  if (days >= 60) { return "60+ days"; }
  if (days >= 30) { return "30+ days"; }
  return "current";
}

function riskLabel(days) {
  var band = riskBand(days);
  if (band === "60+ days") { return "HIGH RISK"; }
  if (band === "30+ days") { return "MEDIUM RISK"; }
  return "CURRENT";
}

function findCustomer(customers, id) {
  for (var i = 0; i < customers.length; i++) {
    if (customers[i].id === id) { return customers[i]; }
  }
  return null;
}

function filterCustomers(customers, query, band) {
  var q = (query || "").toLowerCase().trim();
  return customers.filter(function (c) {
    var matchesQuery = !q ||
      c.name.toLowerCase().indexOf(q) !== -1 ||
      c.city.toLowerCase().indexOf(q) !== -1 ||
      c.id.toLowerCase().indexOf(q) !== -1;
    var matchesBand = !band || band === "All" || riskBand(c.overdueDays) === band;
    return matchesQuery && matchesBand;
  });
}

function shopTotals(customers) {
  var total = 0, overdue = 0;
  customers.forEach(function (c) {
    total += c.balance;
    if (c.overdueDays >= 30) { overdue += c.balance; }
  });
  return { totalOutstanding: total, overdueTotal: overdue, count: customers.length };
}

/* Record a payment against a balance. Pure: returns a result, mutates nothing. */
function applyPayment(balance, amount) {
  balance = Number(balance); amount = Number(amount);
  if (isNaN(balance) || isNaN(amount) || amount <= 0) {
    return { ok: false, message: "Enter a payment amount above zero." };
  }
  if (amount > balance) {
    return { ok: false, message: "Payment cannot be more than the balance owed." };
  }
  return { ok: true, newBalance: balance - amount, paid: amount,
           message: "Payment recorded. New balance: " + formatPKR(balance - amount) + "." };
}

function makeReceiptNumber(n) {
  var s = String(n);
  while (s.length < 4) { s = "0" + s; }
  return "KH-2026-" + s;
}

function nextReceiptNumber(existing) {
  var max = 0;
  (existing || []).forEach(function (r) {
    var m = /KH-2026-(\d{4})$/.exec(r);
    if (m && Number(m[1]) > max) { max = Number(m[1]); }
  });
  return makeReceiptNumber(max + 1);
}

function reminderText(customer) {
  return "Assalam-o-Alaikum " + customer.name + ", a friendly reminder: " +
    formatPKR(customer.balance) + " is pending at " + SHOP.name + ", " +
    customer.city + ". Please visit this week — JazakAllah!";
}

function dailySummary(shop) {
  return formatPKR(shop.dailyCollection) + " collected today · " +
    shop.dailyPayments + " payments · target " +
    formatPKR(shop.weeklyTarget) + " this week for winter stock.";
}
