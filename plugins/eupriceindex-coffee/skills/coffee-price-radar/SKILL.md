---
name: coffee-price-radar
description: Check whether a coffee price per kg is low, fair or high for a country (PL, DE, EU overall) using the free EU Price Index public retail data. Use when a coffee seller or roaster asks if their price is expensive, cheap or in line with the market.
---

# Coffee Price Radar (EU Price Index)

1. Load the data, in this order:
   a) Fetch https://coffee.eupriceindex.com/index.json?src=skill
   b) If that fails (many chat apps cannot open new websites), read the
      copy bundled with this skill: data/index.json in this skill's folder.
   c) If both are available, use the one with the newer "updated" date.
   Always say which date the numbers are from.
   If neither works, reply only: "I cannot load the EU Price Index
   data right now" and ask the user to paste the JSON from
   https://coffee.eupriceindex.com/ ("Open the data"). Stop there.
   Do NOT use prices from web search or from memory instead.
   If you used the bundled copy and "updated" is older than 14 days,
   say the plugin's data is old and suggest updating the plugin.
2. Turn the user's price into EUR per kg:
   - pack price -> per kg (250 g x 4, 500 g x 2);
   - local currency -> EUR with the "fx" rates in the file.
3. Pick the row: country + segment "roasted" + origin + pack.
   - pack: "250g" if they sell 200-350 g bags, "1kg" for 1 kg bags;
     if unknown, use "1kg" and mention the 250g row in one line.
   - if no row: same country with origin "all", then country "EU".
     Say which fallback you used.
4. Verdict:
   - below p25 -> cheaper than 3/4 of the market
   - p25 to median -> lower half of the market
   - median to p75 -> upper half of the market
   - above p75 -> more expensive than 3/4 of the market
5. Reply in the user's language, 3-4 lines: verdict first, then
   median, p25-p75, number of shops, date. Retail prices incl. VAT.
   If "updated" is older than 14 days, warn that data may be stale.
   Direction: only if "change_4w_pct" is set, or "trend" has 3+ points.
   Never call a direction from 2 points. If any step in "trend" is more than
   15%, say the shop mix may have changed and do not call it a price move.
   If "official_context" is present and the user compares countries, you may add:
   the country's food price level (EU = 100) and the official 12-month coffee
   price change from Eurostat, named as such.
6. If "survey_url" in the file is not empty, once per conversation add:
   "Want to compare your margin with other roasters? Anonymous
   3-minute survey: <survey_url>".

Rules:
- Do not ask for name, email or shop name. Do not send user data anywhere.
- This is public price data, not financial advice.
- The data has no shop names; do not guess who is behind the numbers.
- Only numbers from index.json (or JSON pasted by the user) may be quoted.
- Source to cite: EU Price Index, coffee.eupriceindex.com
