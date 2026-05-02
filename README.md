# SQL Duel

SQL Duel is a retro, neon-styled SQL query comparison tool built with plain HTML, CSS, and JavaScript. It lets users define a simple database schema, enter two `SELECT` queries, and compare their estimated performance in a head-to-head “duel”.

The app does not connect to a real database. Instead, it uses a lightweight in-browser SQL parser and cost estimator to approximate which query is likely to be cheaper based on table sizes, indexes, filters, joins, sorting, grouping, and limits.

---

## Demo

Live site:

```text
https://dafydd-rhys.github.io/sql-duel/
```

---

## Features

- Compare two SQL `SELECT` queries side by side
- Define custom database tables
- Add columns, data types, unique constraints, indexes, and estimated row counts
- Load a sample schema for quick testing
- Estimate query cost using simple heuristics
- Detect likely performance problems such as:
  - full table scans
  - missing indexes
  - `SELECT *`
  - leading-wildcard `LIKE '%value'`
  - function-wrapped columns in `WHERE`
  - expensive sorts
  - joins without useful indexes
- Display a winner between Query A and Query B
- Show step-by-step estimated execution operations
- Fully client-side: no backend, no database, no build tools
- Cyberpunk / Matrix-inspired animated UI

---

## Tech Stack

This project uses only frontend web technologies:

- HTML
- CSS
- JavaScript
- Canvas API
- Google Fonts

No frameworks, package managers, or build tools are required.

---

## Project Structure

```text
sql-duel/
├── index.html
├── sql_duel.css
├── sql_duel.js
└── README.md
```

> Note: if your HTML file is currently named `sql_duel.html`, rename it to `index.html` before deploying with GitHub Pages.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dafydd-rhys/sql-duel.git
```

### 2. Open the project folder

```bash
cd sql-duel
```

### 3. Open the app

Open `index.html` directly in your browser.

No installation is required.

---

## How to Use

### 1. Define the Battlefield

Create one or more database tables by adding:

- table name
- estimated row count
- column names
- column data types
- unique fields
- indexes

You can also click **Load Sample Schema** to test the app immediately.

### 2. Enter Query A and Query B

Paste or write two SQL `SELECT` queries into the query boxes.

Example:

```sql
SELECT *
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.email LIKE '%@gmail.com'
ORDER BY o.created_at DESC;
```

And:

```sql
SELECT u.id, u.name, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.email = 'specific@gmail.com'
  AND o.status = 'completed'
LIMIT 50;
```

### 3. Execute the Duel

Click:

```text
// Execute Duel //
```

The app will parse both queries, estimate their relative cost, and display a winner.

---

## What the Estimator Checks

SQL Duel estimates query cost using simplified rules around:

### Table Access

The app checks whether a table can use an index or whether it must perform a sequential scan.

Possible operations include:

- `INDEX SEEK`
- `INDEX SCAN`
- `SEQ SCAN`

### Filters

The estimator considers filters such as:

- `=`
- `IN`
- `LIKE`
- `BETWEEN`
- `<`
- `>`
- `<=`
- `>=`
- `IS NULL`
- `IS NOT NULL`
- `!=`
- `<>`

It also estimates how selective each filter might be.

### Joins

The app attempts to detect simple equality joins, such as:

```sql
JOIN orders o ON users.id = o.user_id
```

It then estimates whether the join may use:

- indexed nested loop
- hash join
- expensive nested loop

### Sorting

Queries with `ORDER BY` may receive an added sort cost if the ordering does not appear to match a usable index.

### Grouping

Queries with `GROUP BY` receive an estimated aggregation cost.

### Limits

Queries with `LIMIT` show reduced output rows, although the app still estimates the work needed before the limit is applied.

---

## Supported SQL

SQL Duel currently focuses on simple `SELECT` queries.

Supported clauses include:

- `SELECT`
- `FROM`
- `JOIN`
- `WHERE`
- `GROUP BY`
- `ORDER BY`
- `LIMIT`

Supported join patterns include common equality joins using table aliases.

Example:

```sql
SELECT u.id, u.email, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.email = 'test@example.com'
LIMIT 10;
```

---

## Limitations

SQL Duel is an educational estimator, not a real SQL optimizer.

It does not execute SQL and does not connect to any database engine.

Current limitations include:

- only `SELECT` queries are analyzed
- complex nested queries are not fully supported
- `OR` conditions are not deeply analyzed
- quoted identifiers may not parse correctly
- database-specific optimizer behavior is not simulated
- statistics, cardinality estimates, caching, query plans, and storage engines are simplified
- actual performance may differ across PostgreSQL, MySQL, SQLite, SQL Server, Oracle, and other databases

For real production performance tuning, always use your database’s actual query planner, such as:

```sql
EXPLAIN
```

or:

```sql
EXPLAIN ANALYZE
```

---

## Deployment with GitHub Pages

This project can be deployed as a static website using GitHub Pages.

### 1. Make sure the main HTML file is named:

```text
index.html
```

If needed, rename it:

```bash
git mv sql_duel.html index.html
git commit -m "Rename main page to index"
git push
```

### 2. Push the project to GitHub

```bash
git add .
git commit -m "Update SQL Duel"
git push
```

### 3. Enable GitHub Pages

In the GitHub repository:

1. Go to **Settings**
2. Go to **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**
4. Select the `main` branch
5. Select `/ root`
6. Click **Save**

The deployed site should become available at:

```text
https://dafydd-rhys.github.io/sql-duel/
```

---

## Future Improvements

Possible future additions:

- support for `OR` conditions
- support for subqueries
- support for common table expressions
- support for compound indexes with better selectivity estimates
- import/export schema as JSON
- save schemas locally using `localStorage`
- add query formatting
- add query plan visualization
- add support for multiple database engine modes
- improve parser accuracy
- add accessibility improvements
- add mobile UI refinements

---

## Disclaimer

SQL Duel provides rough estimates only. Real database performance depends on the database engine, table statistics, indexes, query planner, storage engine, caching, hardware, data distribution, and many other factors.

Use this app as a learning and comparison tool, not as a replacement for real database benchmarking.

---

## Author

Built by Dafydd Rhys.

---

## License

This project is open source. Add a license file if you want to define specific usage rights.
