---
name: chocolate-price-radar
description: Check whether a chocolate price per kg is low, fair or high in Poland, Germany or France (dark, milk or white; bars or bulk packs of 1 kg and more) using the free EU Price Index daily online-price data. Use when a chocolate seller, chocolatier or shop asks if their price is expensive, cheap or in line with the market.
---

# Chocolate Price Radar (EU Price Index)

1. Load the data, in this order:
   a) Fetch https://eupriceindex.com/chocolate/index.json?src=skill
   b) If that fails (many chat apps cannot open new websites), read the
      copy bundled with this skill: data/index.json in this skill's folder.
   c) If both are available, use the one with the newer "updated" date.
   Always say which date the numbers are from.
   If neither works, reply only: "I cannot load the EU Price Index
   data right now" and ask the user to paste the JSON from
   https://eupriceindex.com/chocolate/index.json. Stop there.
   Do NOT use prices from web search or from memory instead.
   If you used the bundled copy and "updated" is older than 7 days,
   say the plugin's data is old and suggest updating the plugin.
2. Turn the user's price into EUR per kg:
   - pack price -> per kg (100 g bar x 10, 80 g x 12.5, 2.5 kg bag / 2.5);
   - PLN -> EUR: ask for the rate only if the user did not give EUR;
     say which rate you used.
3. Pick the row in "groups": country (PL, DE, FR) + type (dark, milk,
   white) + format ("bar" = bars and tablets of 40-500 g, "bulk" = packs of
   1 kg or more; gift sets, pralines and figures are not in the index).
   - If the format is unclear, ask one short question.
   - If there is no row for that country, compare with the same type and
     format in the other countries and say so clearly.
4. Verdict, from the gap to "eur_kg" (median of the shops):
   - more than 15% below -> clearly cheaper than the typical shop
   - 5-15% below -> a bit cheaper
   - within 5% -> in line with the market
   - 5-15% above -> a bit more expensive
   - more than 15% above -> clearly more expensive
5. Reply in the user's language, 3-4 lines: verdict and gap in % first,
   then the median, number of shops and products, date ("updated").
   Online retail prices incl. VAT. If "updated" is older than 7 days,
   warn that the data may be stale.
   If useful, add one line of context named as such: Eurostat consumer
   price change for chocolate (year on year) for that country from
   "eurostat_hicp_yoy_pct", and cocoa futures over 30 days from
   "cocoa_futures_30d_pct".
6. Note in one line that shop mix differs by country (many Polish shops
   are craft / bean-to-bar), so the same format must be compared.

Rules:
- Do not ask for name, email or shop name. Do not send user data anywhere.
- This is public price data, not financial advice.
- The data has no shop names; do not guess who is behind the numbers.
- Only numbers from index.json (or JSON pasted by the user) may be quoted.
- Source to cite: EU Price Index, eupriceindex.com/chocolate
