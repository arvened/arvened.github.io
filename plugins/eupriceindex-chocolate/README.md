# EU Price Index: Chocolate

Ask Claude whether your chocolate price is low, fair or high, and get an answer based on real market data instead of a guess.

Example: *"I sell dark chocolate bars at 7.90 EUR per 100 g in Germany. Is that expensive?"* or *"Our 2.5 kg bag of milk chocolate callets costs 65 EUR in France. Fair price?"*

## What it does

The plugin adds one skill. When you ask about a chocolate price, Claude:

1. downloads the public index file from the EU Price Index;
2. converts your price to euros per kilogram;
3. finds the matching row (country, type, pack) and tells you where your price sits against the market, with the date of the data.

The index covers dark, milk and white chocolate (bars, and bulk packs of 1 kg or more) in Poland, Germany and France: median of the shops, number of shops and products, plus Eurostat chocolate inflation and the 30-day change of cocoa futures. Updated daily. Prices are public online retail prices including VAT, collected from independent online shops (no marketplaces). The data never contains shop names or individual prices.

## What it fetches and sends

- It reads one public file: `https://eupriceindex.com/chocolate/index.json?src=skill`. The `src=skill` part only lets us count how many requests come from AI chats.
- It sends nothing else anywhere. It does not ask for or store your name, email, shop name or prices.
- No account, no API key, no cost.

## Data and licence

Data: EU Price Index, https://eupriceindex.com/chocolate/ — free to reuse with attribution (CC BY 4.0). It is public price information, not financial advice.

Plugin text and code: MIT licence (see LICENSE).

Contact: partners@eupriceindex.com
