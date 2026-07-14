# Historical Datasets Directory

Place the raw Kaggle CSV datasets directly inside this folder:

- `india_accidents_20k.csv`
- `us_accidents_20k.csv`

## Architecture Note
This directory is located in the Vite `public/` root. Files placed here are **not** bundled by Webpack/Vite. They are served directly via static HTTP requests. 

This is essential for large CSVs (20k+ rows) because bundling them into the JavaScript bundle would result in a multi-megabyte monolithic bundle that drastically slows down initial page load.

The retrieval agent will fetch these datasets asynchronously (e.g., via `/datasets/india_accidents_20k.csv`) and cache them in browser memory.
