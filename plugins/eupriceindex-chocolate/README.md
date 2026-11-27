# EU Price Index: Chocolate

Ask Claude whether your chocolate price is low, fair or high, and get an answer based on real market data instead of a guess.

Example prompts:

- *"I sell dark chocolate bars at 7.90 EUR per 100 g in Germany. Is that expensive?"*
- *"Our 2.5 kg bag of milk chocolate callets costs 65 EUR in France. Fair price?"*
- *"A 70 g bar of white chocolate at 24 PLN in Poland — cheap or expensive?"*

## What it does

The plugin adds one skill. When you ask about a chocolate price, Claude:

1. downloads the public index file from the EU Price Index;
2. converts your price to euros per kilogram;
3. finds the matching row (country, type, pack) and tells you where your price sits against the market, with the date of the data.

The index covers dark, milk and white chocolate (bars, and bulk packs of 1 kg or more) in Poland, Germany and France: median of the shops, number of shops and products, plus Eurostat chocolate inflation and the 30-day change of cocoa futures. Updated daily. Prices are public online retail prices including VAT, collected from independent online shops (no marketplaces). The data never contains shop names or individual prices.

## What it fetches and sends

- It reads one public file: `https://eupriceindex.com/chocolate/index.json?src=skill`. The `src=skill` part only lets us count how many requests come from AI chats.
- If the chat app cannot open websites, it uses a copy of the same public file bundled with the plugin (refreshed daily in this repository).
- It sends nothing else anywhere. It does not ask for or store your name, email, shop name or prices.
- No account, no API key, no cost.

## Data and licence

Data: EU Price Index, https://eupriceindex.com/chocolate/ — please cite the source when you quote it. It is public price information, not financial advice.

Plugin text and code: MIT licence (see LICENSE).

Privacy policy: https://eupriceindex.com/privacy/ — no personal data, no cookies.

Contact: partners@eupriceindex.com (EU Price Index, run by Eduard Arbitman, Kyiv, Ukraine).
