import fs from "fs";
import data from "./data.json" with { type: "json" };;

function combineSimilarItems(data) {
  const map = new Map();

  for (const item of data) {
    const { Company, Model, Grade } = item;

    if (!Model) continue; // Skip if Model is empty

    const key = `${Company}-${Model}-${Grade}`;

    if (map.has(key)) {
      const existing = map.get(key);
      existing.Quantity += item.Quantity;
      existing["Total Price"] = (
        existing.Quantity * existing.Price
      ).toLocaleString();
    } else {
      // Clone item to avoid mutating original
      map.set(key, { ...item });
    }
  }

  const untouched = data.filter((item) => !item.Model);
  const combined = Array.from(map.values());

  return [...combined, ...untouched].map((e) => ({
    company: e.Company || "Unknown",
    model: e.Model || null,
    grade: e.Grade|| null,
    size: e.Size|| null,
    quantity: e.Quantity || 0,
    price: e.Price || 0,
    notes: e.Notes|| null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

const combinedData = combineSimilarItems(data);

console.log("original size", data.length);
console.log("new size", combinedData.length);
console.log("Total Quantity:", combinedData.reduce((sum, item) => sum + (item.quantity), 0));
console.log("Total Price:", combinedData.reduce((sum, item) => sum + (item.quantity * item.price), 0));

fs.writeFileSync(
  "combined.json",
  JSON.stringify(combinedData, null, 2),
  "utf-8"
);

/* 
[
  {
    "Company": "FR",
    "Model": 2000,
    "Grade": "B",
    "Size": "",
    "Quantity": 2383,
    "Price": 25,
    "Total Price": "59,575",
    "Notes": ""
  },
  {
    "Company": "FR",
    "Model": "5002-L",
    "Grade": "A",
    "Size": "",
    "Quantity": 100,
    "Price": 72,
    "Total Price": "7,200",
    "Notes": ""
  },
]

*/
