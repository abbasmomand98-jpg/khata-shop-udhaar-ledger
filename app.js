/* Khata — UI wiring. Payments and receipts are saved in this browser only
   (localStorage), because this is a design demo, not a real ledger. */
(function () {
  var customers = CUSTOMERS.map(function (c) { return Object.assign({}, c); });
  var receipts = JSON.parse(localStorage.getItem("khata-receipts") || "null") || SAMPLE_RECEIPTS.slice();
  var payments = JSON.parse(localStorage.getItem("khata-payments") || "[]");
  var selectedId = customers[0].id;

  function el(id) { return document.getElementById(id); }

  function save() {
    localStorage.setItem("khata-receipts", JSON.stringify(receipts));
    localStorage.setItem("khata-payments", JSON.stringify(payments));
  }

  function renderSummary() {
    var t = shopTotals(customers);
    el("summary-total").textContent = formatPKR(t.totalOutstanding);
    el("summary-count").textContent = t.count + " customers · sample data";
    el("summary-collected").textContent = formatPKR(SHOP.collectedThisMonth);
    el("summary-daily").textContent = dailySummary(SHOP);
    el("summary-overdue").textContent = formatPKR(t.overdueTotal) + " overdue (30+ days)";
  }

  function renderList() {
    var list = filterCustomers(customers, el("customer-search").value, el("band-filter").value);
    el("customer-count").textContent = list.length + " customer(s) shown";
    el("customer-list").innerHTML = list.map(function (c) {
      var band = riskBand(c.overdueDays);
      return "<article class='cust' data-id='" + c.id + "'>" +
        "<div><strong>" + c.name + " — Sample</strong>" +
        "<p>" + c.city + " · " + c.overdueDays + " days overdue · " + c.note + "</p></div>" +
        "<div class='right'><strong>" + formatPKR(c.balance) + "</strong>" +
        "<span class='flag " + band.replace(/[^a-z0-9]/g, "") + "'>" + riskLabel(c.overdueDays) + "</span></div>" +
        "</article>";
    }).join("") || "<p class='muted'>No customers match that search.</p>";
    document.querySelectorAll("#customer-list .cust").forEach(function (node) {
      node.addEventListener("click", function () { selectCustomer(node.getAttribute("data-id")); });
    });
  }

  function selectCustomer(id) {
    selectedId = id;
    var c = findCustomer(customers, id);
    el("detail-name").textContent = c.name + " — Sample";
    el("detail-meta").textContent = c.city + " · " + c.note;
    el("detail-balance").textContent = formatPKR(c.balance);
    el("detail-risk").textContent = c.overdueDays + " days overdue · " + riskLabel(c.overdueDays);
    el("txn-list").innerHTML = (TRANSACTIONS[id] || []).map(function (t) {
      var cls = t.amount < 0 ? "paid" : "owed";
      return "<li><span><strong>" + t.date + "</strong><br>" + t.desc + "</span>" +
        "<strong class='" + cls + "'>" + (t.amount < 0 ? "− " : "+ ") + formatPKR(Math.abs(t.amount)) + "</strong></li>";
    }).join("");
    el("reminder-text").textContent = reminderText(c);
    el("payment-amount").value = "";
    el("payment-result").hidden = true;
    el("receipt-line").hidden = true;
  }

  el("customer-search").addEventListener("input", renderList);
  el("band-filter").addEventListener("change", renderList);

  el("payment-btn").addEventListener("click", function () {
    var c = findCustomer(customers, selectedId);
    var res = applyPayment(c.balance, el("payment-amount").value);
    var out = el("payment-result");
    out.hidden = false;
    if (!res.ok) { out.textContent = res.message; out.className = "error"; return; }
    c.balance = res.newBalance;
    var receipt = nextReceiptNumber(receipts);
    receipts.push(receipt);
    payments.push({ customer: c.id, amount: res.paid, receipt: receipt, date: new Date().toISOString().slice(0, 10) });
    save();
    out.textContent = res.message;
    out.className = "success";
    el("receipt-line").hidden = false;
    el("receipt-line").textContent = "Digital receipt: " + receipt + " · saved on this device.";
    renderSummary(); renderList(); selectCustomer(selectedId);
  });

  el("reminder-btn").addEventListener("click", function () {
    var c = findCustomer(customers, selectedId);
    el("reminder-text").textContent = reminderText(c);
    el("reminder-note").textContent = "Reminder text ready — copy it and send it from your own phone. Khata never sends messages itself.";
  });

  el("reset-btn").addEventListener("click", function () {
    localStorage.removeItem("khata-receipts");
    localStorage.removeItem("khata-payments");
    location.reload();
  });

  renderSummary(); renderList(); selectCustomer(selectedId);
})();
