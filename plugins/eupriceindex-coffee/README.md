# EU Price Index: Coffee

Ask Claude whether your coffee price is low, fair or high, and get an answer based on real market data instead of a guess.

Example prompts:

- *"I sell Ethiopian coffee at 28 EUR per kg in 1 kg bags. Is that high for Poland?"*
- *"Our Colombian 250 g bag costs 16.90 EUR in Germany. Fair price?"*
- *"We charge 89 PLN for 500 g of Brazil. Where is that versus the EU market?"*

## What it does

The plugin adds one skill. When you ask about a coffee price, Claude:

1. downloads the public index file from the EU Price Index;
2. converts your price to euros per kilogram;
3. finds the matching row (country, type, pack) and tells you where your price sits against the market, with the date of the data.

The index covers roasted single-origin coffee (250 g and 1 kg packs) by country and origin: median, 25th and 75th percentile, number of shops. Countries with too few shops show EU-wide figures only. Updated weekly. Prices are public online retail prices including VAT, collected from independent online shops (no marketplaces). The data never contains shop names or individual prices.

## What it fetches and sends

- It reads one public file: `https://coffee.eupriceindex.com/index.json?src=skill`. The `src=skill` part only lets us count how many requests come from AI chats.
- If the chat app cannot open websites, it uses a copy of the same public file bundled with the plugin (refreshed daily in this repository).
- It sends nothing else anywhere. It does not ask for or store your name, email, shop name or prices.
- No account, no API key, no cost.

## Data and licence

Data: EU Price Index, https://coffee.eupriceindex.com/ — free to reuse with attribution (CC BY 4.0). It is public price information, not financial advice.

Plugin text and code: MIT licence (see LICENSE).

Privacy policy: https://eupriceindex.com/privacy/ — no personal data, no cookies.

Contact: partners@eupriceindex.com (EU Price Index, run by Eduard Arbitman, Kyiv, Ukraine).
