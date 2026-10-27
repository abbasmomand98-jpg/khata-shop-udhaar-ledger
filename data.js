/* Khata — sample data ONLY. Every customer, shop, amount and receipt below is
   invented for demonstrating the design. No real person, shop or phone number
   is shown. Do not enter real customer data into this demo. */
var SHOP = {
  name: "Sample General Store",
  city: "Peshawar",
  collectedThisMonth: 31200,
  dailyCollection: 4600,
  dailyPayments: 3,
  weeklyTarget: 20000
};

var CUSTOMERS = [
  { id: "KH-C01", name: "Ahmed", city: "Peshawar", balance: 12400, overdueDays: 62, note: "Regular since Jan 2026" },
  { id: "KH-C02", name: "Bilal", city: "Lahore", balance: 8900, overdueDays: 34, note: "Pays in parts" },
  { id: "KH-C03", name: "Fatima", city: "Karachi", balance: 6250, overdueDays: 0, note: "Due in 3 days" },
  { id: "KH-C04", name: "Usman", city: "Islamabad", balance: 4100, overdueDays: 5, note: "Current" },
  { id: "KH-C05", name: "Zainab", city: "Rawalpindi", balance: 7300, overdueDays: 41, note: "Promised this week" },
  { id: "KH-C06", name: "Hassan", city: "Quetta", balance: 3200, overdueDays: 12, note: "Current" },
  { id: "KH-C07", name: "Ayesha", city: "Peshawar", balance: 2800, overdueDays: 0, note: "New customer" },
  { id: "KH-C08", name: "Omar", city: "Karachi", balance: 1100, overdueDays: 18, note: "Current" },
  { id: "KH-C09", name: "Sana", city: "Lahore", balance: 1500, overdueDays: 7, note: "Current" },
  { id: "KH-C10", name: "Ali", city: "Islamabad", balance: 1200, overdueDays: 2, note: "Current" }
];

/* A few sample transactions per customer (Ahmed's match the case-study mockup). */
var TRANSACTIONS = {
  "KH-C01": [
    { date: "12 Oct 2026", desc: "Groceries on credit", amount: 3200 },
    { date: "28 Sep 2026", desc: "Partial payment received", amount: -2000 },
    { date: "15 Sep 2026", desc: "Groceries on credit", amount: 4500 },
    { date: "02 Sep 2026", desc: "Payment received", amount: -1500 },
    { date: "20 Aug 2026", desc: "Groceries on credit", amount: 5100 }
  ],
  "KH-C02": [
    { date: "10 Oct 2026", desc: "Groceries on credit", amount: 4000 },
    { date: "20 Sep 2026", desc: "Payment received", amount: -1000 }
  ],
  "KH-C03": [
    { date: "18 Oct 2026", desc: "Groceries on credit", amount: 6250 }
  ],
  "KH-C04": [
    { date: "05 Oct 2026", desc: "Groceries on credit", amount: 4100 }
  ],
  "KH-C05": [
    { date: "08 Oct 2026", desc: "Groceries on credit", amount: 7300 }
  ],
  "KH-C06": [
    { date: "14 Oct 2026", desc: "Groceries on credit", amount: 3200 }
  ],
  "KH-C07": [
    { date: "19 Oct 2026", desc: "Groceries on credit", amount: 2800 }
  ],
  "KH-C08": [
    { date: "11 Oct 2026", desc: "Groceries on credit", amount: 1100 }
  ],
  "KH-C09": [
    { date: "16 Oct 2026", desc: "Groceries on credit", amount: 1500 }
  ],
  "KH-C10": [
    { date: "17 Oct 2026", desc: "Groceries on credit", amount: 1200 }
  ]
};

var SAMPLE_RECEIPTS = ["KH-2026-1042", "KH-2026-1031"];
