/* ═══════════════════════════════════════════════════════════════
   MATRIX RAIN
   ═══════════════════════════════════════════════════════════════ */
(function matrixRain() {
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d");
  let cols, drops;
  const chars =
    "アァカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789∆∂∑Ω░▒▓│┤┐└┴┬├─┼╔╗╚╝;<>?/[]{}".split(
      "",
    );
  const fontSize = 16;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / fontSize);
    drops = Array(cols)
      .fill(0)
      .map(() => (Math.random() * -canvas.height) / fontSize);
  }
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    ctx.fillStyle = "rgba(7, 0, 26, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px 'Share Tech Mono', monospace";
    for (let i = 0; i < cols; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const char = chars[Math.floor(Math.random() * chars.length)];
      // leading char: brighter (neon green or pink occasionally)
      const isLead = Math.random() > 0.97;
      const isPink = Math.random() > 0.985;
      ctx.fillStyle = isPink ? "#ff2bd6" : isLead ? "#aaffbb" : "#39ff5a";
      ctx.fillText(char, x, y);
      drops[i]++;
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
    }
  }
  setInterval(draw, 55);
})();

/* ═══════════════════════════════════════════════════════════════
   SCHEMA STATE
   ═══════════════════════════════════════════════════════════════ */
const COLUMN_TYPES = [
  "int",
  "bigint",
  "varchar",
  "text",
  "decimal",
  "boolean",
  "timestamp",
  "date",
  "uuid",
  "json",
];

let schemaState = []; // [{name, rowCount, columns:[{name,type,unique}], indexes:[{name,columns:[],unique}]}]

function newTable(name = "") {
  return {
    id: "t_" + Math.random().toString(36).slice(2, 9),
    name,
    rowCount: 1000,
    columns: [],
    indexes: [],
  };
}
function newColumn(name = "", type = "int", unique = false) {
  return {
    id: "c_" + Math.random().toString(36).slice(2, 9),
    name,
    type,
    unique,
  };
}
function newIndex(name = "", columns = "", unique = false) {
  return {
    id: "i_" + Math.random().toString(36).slice(2, 9),
    name,
    columns,
    unique,
  };
}

function loadSampleSchema() {
  schemaState = [
    {
      id: "t_users",
      name: "users",
      rowCount: 100000,
      columns: [
        newColumn("id", "int", true),
        newColumn("email", "varchar", true),
        newColumn("name", "varchar", false),
        newColumn("country", "varchar", false),
        newColumn("created_at", "timestamp", false),
      ],
      indexes: [
        newIndex("pk_users", "id", true),
        newIndex("idx_users_email", "email", true),
        newIndex("idx_users_country", "country", false),
      ],
    },
    {
      id: "t_orders",
      name: "orders",
      rowCount: 2000000,
      columns: [
        newColumn("id", "int", true),
        newColumn("user_id", "int", false),
        newColumn("amount", "decimal", false),
        newColumn("status", "varchar", false),
        newColumn("created_at", "timestamp", false),
      ],
      indexes: [
        newIndex("pk_orders", "id", true),
        newIndex("idx_orders_user", "user_id", false),
        newIndex("idx_orders_created", "created_at", false),
      ],
    },
  ];
  renderSchema();
}

/* ═══════════════════════════════════════════════════════════════
   SCHEMA RENDERING
   ═══════════════════════════════════════════════════════════════ */
function renderSchema() {
  const c = document.getElementById("tables-container");
  c.innerHTML = "";
  if (schemaState.length === 0) {
    c.innerHTML =
      '<div style="color:var(--text-dim); font-style:italic; padding:20px; text-align:center; grid-column:1/-1;">// no tables yet — add one or load the sample</div>';
    return;
  }
  for (const tbl of schemaState) {
    c.appendChild(renderTableCard(tbl));
  }
}

function renderTableCard(tbl) {
  const card = document.createElement("div");
  card.className = "table-card";

  // Header
  const header = document.createElement("div");
  header.className = "table-card-header";
  header.innerHTML = `<span class="label">▌TABLE</span>`;
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = tbl.name;
  nameInput.placeholder = "table_name";
  nameInput.className = "table-name-input";
  nameInput.oninput = (e) => {
    tbl.name = e.target.value.trim();
  };
  header.appendChild(nameInput);
  const delBtn = document.createElement("button");
  delBtn.className = "danger";
  delBtn.textContent = "⨯";
  delBtn.title = "Delete table";
  delBtn.onclick = () => {
    schemaState = schemaState.filter((t) => t.id !== tbl.id);
    renderSchema();
  };
  header.appendChild(delBtn);
  card.appendChild(header);

  // Columns
  const colsLabel = document.createElement("div");
  colsLabel.className = "sub-label";
  colsLabel.textContent = "columns";
  card.appendChild(colsLabel);

  const colsList = document.createElement("div");
  colsList.className = "col-list";
  for (const col of tbl.columns)
    colsList.appendChild(renderColumnRow(tbl, col));
  card.appendChild(colsList);

  const addColBtn = document.createElement("button");
  addColBtn.className = "add-btn";
  addColBtn.style.marginTop = "8px";
  addColBtn.textContent = "＋ column";
  addColBtn.onclick = () => {
    tbl.columns.push(newColumn());
    renderSchema();
  };
  card.appendChild(addColBtn);

  // Indexes
  const idxLabel = document.createElement("div");
  idxLabel.className = "sub-label";
  idxLabel.textContent = "indexes";
  card.appendChild(idxLabel);

  const idxList = document.createElement("div");
  idxList.className = "idx-list";
  for (const idx of tbl.indexes) idxList.appendChild(renderIndexRow(tbl, idx));
  card.appendChild(idxList);

  const addIdxBtn = document.createElement("button");
  addIdxBtn.className = "add-btn";
  addIdxBtn.style.marginTop = "8px";
  addIdxBtn.textContent = "＋ index";
  addIdxBtn.onclick = () => {
    tbl.indexes.push(newIndex());
    renderSchema();
  };
  card.appendChild(addIdxBtn);

  // Row count
  const rcWrap = document.createElement("div");
  rcWrap.className = "row-count-wrap";
  rcWrap.innerHTML = `<label>≈ rows:</label>`;
  const rcInput = document.createElement("input");
  rcInput.type = "number";
  rcInput.value = tbl.rowCount;
  rcInput.min = 0;
  rcInput.oninput = (e) => {
    tbl.rowCount = parseInt(e.target.value) || 0;
  };
  rcWrap.appendChild(rcInput);
  card.appendChild(rcWrap);

  return card;
}

function renderColumnRow(tbl, col) {
  const row = document.createElement("div");
  row.className = "field-row";
  const nameI = document.createElement("input");
  nameI.type = "text";
  nameI.value = col.name;
  nameI.placeholder = "column_name";
  nameI.style.flex = "2";
  nameI.oninput = (e) => {
    col.name = e.target.value.trim();
  };
  row.appendChild(nameI);

  const typeS = document.createElement("select");
  typeS.style.flex = "1";
  for (const t of COLUMN_TYPES) {
    const o = document.createElement("option");
    o.value = t;
    o.textContent = t;
    if (t === col.type) o.selected = true;
    typeS.appendChild(o);
  }
  typeS.onchange = (e) => {
    col.type = e.target.value;
  };
  row.appendChild(typeS);

  const uniqueLbl = document.createElement("label");
  uniqueLbl.className = "checkbox-wrap";
  const uCheck = document.createElement("input");
  uCheck.type = "checkbox";
  uCheck.checked = col.unique;
  uCheck.onchange = (e) => {
    col.unique = e.target.checked;
  };
  uniqueLbl.appendChild(uCheck);
  uniqueLbl.append("uniq");
  row.appendChild(uniqueLbl);

  const del = document.createElement("button");
  del.className = "danger";
  del.textContent = "⨯";
  del.onclick = () => {
    tbl.columns = tbl.columns.filter((c) => c.id !== col.id);
    renderSchema();
  };
  row.appendChild(del);
  return row;
}

function renderIndexRow(tbl, idx) {
  const row = document.createElement("div");
  row.className = "field-row";
  const nameI = document.createElement("input");
  nameI.type = "text";
  nameI.value = idx.name;
  nameI.placeholder = "idx_name";
  nameI.style.flex = "1.5";
  nameI.oninput = (e) => {
    idx.name = e.target.value.trim();
  };
  row.appendChild(nameI);

  const colsI = document.createElement("input");
  colsI.type = "text";
  colsI.value = idx.columns;
  colsI.placeholder = "col1, col2";
  colsI.style.flex = "2";
  colsI.oninput = (e) => {
    idx.columns = e.target.value.trim();
  };
  row.appendChild(colsI);

  const uniqueLbl = document.createElement("label");
  uniqueLbl.className = "checkbox-wrap";
  const uCheck = document.createElement("input");
  uCheck.type = "checkbox";
  uCheck.checked = idx.unique;
  uCheck.onchange = (e) => {
    idx.unique = e.target.checked;
  };
  uniqueLbl.appendChild(uCheck);
  uniqueLbl.append("uniq");
  row.appendChild(uniqueLbl);

  const del = document.createElement("button");
  del.className = "danger";
  del.textContent = "⨯";
  del.onclick = () => {
    tbl.indexes = tbl.indexes.filter((i) => i.id !== idx.id);
    renderSchema();
  };
  row.appendChild(del);
  return row;
}

/* ═══════════════════════════════════════════════════════════════
   SQL PARSER
   ═══════════════════════════════════════════════════════════════ */
function parseSQL(sql) {
  const result = {
    raw: sql,
    type: null,
    select: [],
    selectAll: false,
    from: null,
    joins: [],
    where: [],
    orderBy: [],
    groupBy: [],
    limit: null,
    issues: [],
  };
  if (!sql || !sql.trim()) {
    result.issues.push("Query is empty");
    return result;
  }
  // Strip comments and normalize whitespace
  let cleaned = sql
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\s+/g, " ")
    .replace(/;\s*$/, "")
    .trim();

  const typeMatch = cleaned.match(/^\s*(SELECT|UPDATE|DELETE|INSERT)\b/i);
  if (!typeMatch) {
    result.issues.push("Could not identify query type — only SELECT supported");
    return result;
  }
  result.type = typeMatch[1].toUpperCase();
  if (result.type !== "SELECT") {
    result.issues.push(
      `${result.type} queries are not analyzed — only SELECT for now`,
    );
    return result;
  }

  // SELECT clause
  const selMatch = cleaned.match(/^SELECT\s+(?:DISTINCT\s+)?(.+?)\s+FROM\s+/i);
  if (selMatch) {
    const cols = selMatch[1].split(",").map((s) => s.trim());
    result.select = cols;
    if (cols.includes("*") || cols.some((c) => /^\w+\.\*$/.test(c)))
      result.selectAll = true;
  } else {
    result.issues.push("Could not parse SELECT clause");
    return result;
  }

  // FROM clause
  const fromMatch = cleaned.match(
    /\bFROM\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?(?=\s|$)/i,
  );
  if (fromMatch) {
    const t = fromMatch[1];
    const a = fromMatch[2];
    const reserved = [
      "WHERE",
      "JOIN",
      "INNER",
      "LEFT",
      "RIGHT",
      "FULL",
      "CROSS",
      "GROUP",
      "ORDER",
      "LIMIT",
      "ON",
    ];
    result.from = {
      table: t,
      alias: a && !reserved.includes(a.toUpperCase()) ? a : t,
    };
  } else {
    result.issues.push("Missing FROM clause");
    return result;
  }

  // JOINs
  const joinRegex =
    /\b(INNER|LEFT(?:\s+OUTER)?|RIGHT(?:\s+OUTER)?|FULL(?:\s+OUTER)?|CROSS)?\s*JOIN\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?\s+ON\s+(.+?)(?=\s+(?:INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\s+|\s+WHERE\s+|\s+GROUP\s+BY\s+|\s+ORDER\s+BY\s+|\s+LIMIT\s+|$)/gi;
  let jm;
  while ((jm = joinRegex.exec(cleaned)) !== null) {
    const reserved = [
      "WHERE",
      "JOIN",
      "INNER",
      "LEFT",
      "RIGHT",
      "FULL",
      "CROSS",
      "GROUP",
      "ORDER",
      "LIMIT",
      "ON",
    ];
    const aliasCandidate = jm[3];
    result.joins.push({
      type: (jm[1] || "INNER").toUpperCase().replace(/\s+OUTER/, ""),
      table: jm[2],
      alias:
        aliasCandidate && !reserved.includes(aliasCandidate.toUpperCase())
          ? aliasCandidate
          : jm[2],
      on: jm[4].trim(),
    });
  }

  // WHERE
  const whMatch = cleaned.match(
    /\bWHERE\s+(.+?)(?=\s+GROUP\s+BY\s+|\s+ORDER\s+BY\s+|\s+LIMIT\s+|$)/i,
  );
  if (whMatch) {
    const conds = splitOnAnd(whMatch[1]);
    result.where = conds.map(parseCondition);
  }

  // GROUP BY
  const gbMatch = cleaned.match(
    /\bGROUP\s+BY\s+(.+?)(?=\s+ORDER\s+BY\s+|\s+LIMIT\s+|$)/i,
  );
  if (gbMatch) result.groupBy = gbMatch[1].split(",").map((s) => s.trim());

  // ORDER BY
  const obMatch = cleaned.match(/\bORDER\s+BY\s+(.+?)(?=\s+LIMIT\s+|$)/i);
  if (obMatch) result.orderBy = obMatch[1].split(",").map((s) => s.trim());

  // LIMIT
  const lmMatch = cleaned.match(/\bLIMIT\s+(\d+)/i);
  if (lmMatch) result.limit = parseInt(lmMatch[1]);

  return result;
}

function splitOnAnd(s) {
  // Naive split — doesn't handle nested OR groups or quoted ANDs.
  return s.split(/\s+AND\s+/i);
}

function parseCondition(c) {
  const cond = c.trim();
  // LIKE
  let m = cond.match(/^([\w.()\s]+?)\s+(NOT\s+)?LIKE\s+'(.*)'$/i);
  if (m) {
    const pattern = m[3];
    return {
      raw: cond,
      column: m[1].trim(),
      operator: (m[2] ? "NOT " : "") + "LIKE",
      pattern,
      isLike: true,
      isPrefixLike: !pattern.startsWith("%") && pattern.includes("%"),
      isFullWildcard: pattern.startsWith("%"),
      hasFunction: /\(.*\)/.test(m[1]),
    };
  }
  // IN
  m = cond.match(/^([\w.()\s]+?)\s+(NOT\s+)?IN\s*\((.+)\)$/i);
  if (m) {
    const vals = m[3].split(",").map((v) => v.trim());
    return {
      raw: cond,
      column: m[1].trim(),
      operator: (m[2] ? "NOT " : "") + "IN",
      values: vals,
      hasFunction: /\(.*\)/.test(m[1]),
    };
  }
  // BETWEEN
  m = cond.match(/^([\w.()\s]+?)\s+BETWEEN\s+(.+?)\s+AND\s+(.+)$/i);
  if (m) {
    return {
      raw: cond,
      column: m[1].trim(),
      operator: "BETWEEN",
      from: m[2],
      to: m[3],
      hasFunction: /\(.*\)/.test(m[1]),
    };
  }
  // IS NULL / IS NOT NULL
  m = cond.match(/^([\w.()\s]+?)\s+IS\s+(NOT\s+)?NULL$/i);
  if (m) {
    return {
      raw: cond,
      column: m[1].trim(),
      operator: "IS" + (m[2] ? " NOT" : "") + " NULL",
      hasFunction: /\(.*\)/.test(m[1]),
    };
  }
  // comparison
  m = cond.match(/^(.+?)\s*(<>|!=|<=|>=|=|<|>)\s*(.+)$/);
  if (m) {
    const left = m[1].trim();
    return {
      raw: cond,
      column: left,
      operator: m[2],
      value: m[3].trim(),
      hasFunction: /\(.*\)/.test(left),
    };
  }
  return { raw: cond, unparsed: true };
}

/* ═══════════════════════════════════════════════════════════════
   COST ESTIMATOR
   ═══════════════════════════════════════════════════════════════ */
function buildSchemaIndex() {
  // Returns { tableName: {rowCount, columns: [{name,type,unique}], indexes: [{name,cols:[],unique}]} }
  const idx = {};
  for (const t of schemaState) {
    if (!t.name) continue;
    const indexes = t.indexes
      .filter((i) => i.columns)
      .map((i) => ({
        name: i.name || "idx_" + i.columns.replace(/\W+/g, "_"),
        cols: i.columns
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        unique: i.unique,
      }));
    // Add implicit unique-column indexes
    for (const c of t.columns) {
      if (c.unique) {
        const exists = indexes.some(
          (ix) => ix.cols.length === 1 && ix.cols[0] === c.name,
        );
        if (!exists)
          indexes.push({
            name: "auto_uniq_" + c.name,
            cols: [c.name],
            unique: true,
          });
      }
    }
    idx[t.name] = {
      rowCount: t.rowCount || 1000,
      columns: t.columns.filter((c) => c.name),
      indexes,
    };
  }
  return idx;
}

function findUsableIndex(tableSchema, filteredCols) {
  // Prefer indexes whose leading column matches an equality filter.
  // Returns {index, leadingCol, leadingFilter} or null.
  let best = null;
  for (const idx of tableSchema.indexes) {
    const leading = idx.cols[0];
    const filter = filteredCols.find((f) => f.colName === leading);
    if (!filter) continue;
    const score = scoreFilter(filter.filter);
    if (!best || score > best.score) {
      best = {
        index: idx,
        leadingCol: leading,
        leadingFilter: filter.filter,
        score,
      };
    }
  }
  return best;
}

function scoreFilter(f) {
  if (!f || f.unparsed) return 0;
  if (f.hasFunction) return 0;
  if (f.operator === "=") return 100;
  if (f.operator === "IN") return 80;
  if (f.operator === "LIKE" && f.isPrefixLike) return 60;
  if (["<", ">", "<=", ">=", "BETWEEN"].includes(f.operator)) return 50;
  if (f.operator === "IS NULL" || f.operator === "IS NOT NULL") return 40;
  return 10;
}

function selectivity(filter, tableSchema, colName) {
  const rows = tableSchema.rowCount;
  const colInfo = tableSchema.columns.find((c) => c.name === colName);
  if (!filter || filter.unparsed || filter.hasFunction) return 1.0;

  if (filter.operator === "=") {
    if (colInfo && colInfo.unique) return 1 / Math.max(1, rows);
    return 1 / Math.max(10, rows / 100);
  }
  if (filter.operator === "IN") {
    const n = (filter.values || []).length || 1;
    if (colInfo && colInfo.unique) return Math.min(1, n / Math.max(1, rows));
    return Math.min(0.9, n / Math.max(10, rows / 100));
  }
  if (filter.operator === "LIKE") {
    if (filter.isFullWildcard) return 0.25;
    if (filter.isPrefixLike) return 0.1;
    return 1 / Math.max(10, rows / 100);
  }
  if (filter.operator === "NOT LIKE") return 0.85;
  if (["<", ">", "<=", ">="].includes(filter.operator)) return 0.33;
  if (filter.operator === "BETWEEN") return 0.2;
  if (filter.operator === "!=" || filter.operator === "<>") return 0.85;
  if (filter.operator === "IS NULL") return 0.05;
  if (filter.operator === "IS NOT NULL") return 0.95;
  return 0.5;
}

function colNameFromRef(ref, expectedAlias, expectedTable) {
  // strips alias.col -> col if matches; returns null if it's another table's col
  if (!ref) return null;
  if (ref.includes(".")) {
    const [a, c] = ref.split(".");
    if (a === expectedAlias || a === expectedTable) return c;
    return null;
  }
  return ref;
}

function filtersForTable(parsed, aliasOrName, tableName, tableSchema) {
  const out = [];
  for (const w of parsed.where) {
    if (w.unparsed) continue;
    const col = colNameFromRef(w.column, aliasOrName, tableName);
    if (!col) continue;
    const colExists = tableSchema.columns.some((c) => c.name === col);
    if (!colExists) continue;
    out.push({ colName: col, filter: w });
  }
  return out;
}

function estimateAccess(tableName, tableSchema, filters) {
  // filters: [{colName, filter}]
  const rows = tableSchema.rowCount;
  const usable = findUsableIndex(tableSchema, filters);

  if (usable) {
    const leadingSel = selectivity(
      usable.leadingFilter,
      tableSchema,
      usable.leadingCol,
    );
    let matched = Math.max(1, Math.round(rows * leadingSel));
    // Index seek base cost
    let cost = Math.round(Math.log2(Math.max(2, rows)) + matched);

    // Apply remaining filters as residual
    let outRows = matched;
    for (const f of filters) {
      if (f.colName === usable.leadingCol) continue;
      outRows = Math.max(
        1,
        Math.round(outRows * selectivity(f.filter, tableSchema, f.colName)),
      );
    }

    let opLabel = "INDEX SCAN";
    let detail = `${tableName}.${usable.index.name} → ~${matched} rows`;
    if (usable.leadingFilter.operator === "=" && usable.index.unique) {
      opLabel = "INDEX SEEK";
      detail = `${tableName}.${usable.index.name} (unique) → 1 row`;
      cost = Math.round(Math.log2(Math.max(2, rows)) + 1);
      outRows = Math.max(1, outRows);
    }
    return {
      operation: opLabel,
      table: tableName,
      cost,
      outputRows: outRows,
      description: detail,
      filterCol: usable.leadingCol,
      indexName: usable.index.name,
    };
  }

  // Full scan
  let outRows = rows;
  for (const f of filters)
    outRows = Math.max(
      1,
      Math.round(outRows * selectivity(f.filter, tableSchema, f.colName)),
    );
  const warn =
    filters.length > 0
      ? `No index usable on ${tableName} for filters: ${filters.map((f) => f.colName).join(", ")}`
      : `No WHERE filter on ${tableName} — full scan (${rows} rows)`;
  return {
    operation: "SEQ SCAN",
    table: tableName,
    cost: rows,
    outputRows: outRows,
    description: `Full scan of ${tableName} (${rows} rows) → ~${outRows} rows after filter`,
    warning: warn,
  };
}

function analyzeJoinCondition(joinOn, leftAliases, rightAlias, rightTable) {
  // Try to find a column on the right side being equated to something on the left.
  // Naive: split on AND, find an equality with one side referencing rightAlias/rightTable.
  const conds = splitOnAnd(joinOn);
  for (const c of conds) {
    const m = c.match(/^(.+?)\s*=\s*(.+)$/);
    if (!m) continue;
    const left = m[1].trim();
    const right = m[2].trim();
    const tryRef = (ref) => {
      if (!ref.includes(".")) return null;
      const [a, col] = ref.split(".");
      return { alias: a, col };
    };
    const lr = tryRef(left);
    const rr = tryRef(right);
    if (lr && (lr.alias === rightAlias || lr.alias === rightTable))
      return { rightCol: lr.col };
    if (rr && (rr.alias === rightAlias || rr.alias === rightTable))
      return { rightCol: rr.col };
  }
  return null;
}

function estimateJoin(outerRows, join, innerSchema, parsed) {
  const innerName = join.table;
  // Find the inner-side join column
  const ja = analyzeJoinCondition(
    join.on,
    [parsed.from?.alias, parsed.from?.table],
    join.alias,
    join.table,
  );
  if (!ja) {
    const cost = outerRows * innerSchema.rowCount;
    return {
      operation: "NESTED LOOP",
      table: innerName,
      cost,
      outputRows: Math.max(
        1,
        Math.round(outerRows * innerSchema.rowCount * 0.5),
      ),
      description: `Cartesian-ish nested loop over ${innerName} (could not identify indexed join column)`,
      warning: `Join condition on ${innerName} couldn't be parsed as a simple equality on a column — performance unpredictable`,
    };
  }

  // Filters on the inner table from WHERE
  const innerFilters = filtersForTable(
    parsed,
    join.alias,
    join.table,
    innerSchema,
  );

  // Is there an index on the join column (possibly combined with filters)?
  const jcFilter = {
    colName: ja.rightCol,
    filter: { operator: "=", column: ja.rightCol },
  };
  const allInnerFilters = [jcFilter, ...innerFilters];
  const usable = findUsableIndex(innerSchema, allInnerFilters);

  if (usable) {
    // Indexed nested loop: for each outer row, do an index lookup
    const colInfo = innerSchema.columns.find(
      (c) => c.name === usable.leadingCol,
    );
    const matchPerLookup =
      colInfo && colInfo.unique
        ? 1
        : Math.max(
            1,
            Math.round(
              innerSchema.rowCount / Math.max(10, innerSchema.rowCount / 100),
            ),
          );
    const cost = Math.round(
      outerRows *
        (Math.log2(Math.max(2, innerSchema.rowCount)) + matchPerLookup),
    );
    let outputRows = Math.max(1, Math.round(outerRows * matchPerLookup));
    for (const f of innerFilters)
      outputRows = Math.max(
        1,
        Math.round(outputRows * selectivity(f.filter, innerSchema, f.colName)),
      );
    return {
      operation: "NESTED LOOP (idx)",
      table: innerName,
      cost,
      outputRows,
      description: `Indexed nested loop into ${innerName}.${usable.index.name} — ${outerRows} outer × log/seek lookup`,
    };
  }

  // No index on join col — hash join is much better than full nested loop
  const cost = outerRows + innerSchema.rowCount;
  let outputRows = Math.max(
    1,
    Math.round(
      (outerRows * innerSchema.rowCount) / Math.max(innerSchema.rowCount, 100),
    ),
  );
  for (const f of innerFilters)
    outputRows = Math.max(
      1,
      Math.round(outputRows * selectivity(f.filter, innerSchema, f.colName)),
    );
  return {
    operation: "HASH JOIN",
    table: innerName,
    cost,
    outputRows,
    description: `Hash join with ${innerName} (no usable index on ${ja.rightCol})`,
    warning: `Consider indexing ${innerName}.${ja.rightCol} — hash join must materialize ${innerSchema.rowCount} rows`,
  };
}

function estimateQuery(parsed, schemaIndex) {
  const result = {
    valid: parsed.issues.length === 0,
    issues: [...parsed.issues],
    steps: [],
    warnings: [],
    insights: [],
    totalCost: 0,
  };
  if (!result.valid) return result;

  if (!parsed.from) {
    result.valid = false;
    result.issues.push("No FROM clause");
    return result;
  }
  const baseSchema = schemaIndex[parsed.from.table];
  if (!baseSchema) {
    result.valid = false;
    result.issues.push(`Table "${parsed.from.table}" not in schema`);
    return result;
  }

  // Base table access
  const baseFilters = filtersForTable(
    parsed,
    parsed.from.alias,
    parsed.from.table,
    baseSchema,
  );
  // Mark any WHERE filters that wrap the column in a function as warning
  for (const f of baseFilters) {
    if (f.filter.hasFunction) {
      result.warnings.push(
        `WHERE wraps "${f.colName}" in a function — disables index use on ${parsed.from.table}`,
      );
    }
  }
  const baseStep = estimateAccess(parsed.from.table, baseSchema, baseFilters);
  result.steps.push(baseStep);
  result.totalCost += baseStep.cost;
  if (baseStep.warning) result.warnings.push(baseStep.warning);
  let currentRows = baseStep.outputRows;

  // Joins
  for (const join of parsed.joins) {
    const innerSchema = schemaIndex[join.table];
    if (!innerSchema) {
      result.warnings.push(
        `Joined table "${join.table}" not in schema — skipping cost`,
      );
      continue;
    }
    const step = estimateJoin(currentRows, join, innerSchema, parsed);
    result.steps.push(step);
    result.totalCost += step.cost;
    currentRows = step.outputRows;
    if (step.warning) result.warnings.push(step.warning);
  }

  // GROUP BY
  if (parsed.groupBy.length > 0) {
    const cost = Math.round(currentRows * Math.log2(Math.max(2, currentRows)));
    result.steps.push({
      operation: "GROUP/AGGREGATE",
      cost,
      outputRows: Math.max(1, Math.round(currentRows / 5)),
      description: `Aggregate over ${currentRows} rows by ${parsed.groupBy.join(", ")}`,
    });
    result.totalCost += cost;
    currentRows = Math.max(1, Math.round(currentRows / 5));
  }

  // ORDER BY — check if order matches the access path
  if (parsed.orderBy.length > 0) {
    // Simplified: check if first orderBy col is the leading col of the chosen index on base table
    const firstOrderCol = parsed.orderBy[0]
      .replace(/\s+(ASC|DESC)$/i, "")
      .trim();
    const orderColName =
      colNameFromRef(firstOrderCol, parsed.from.alias, parsed.from.table) ||
      firstOrderCol;
    const matchesAccess =
      baseStep.indexName &&
      baseSchema.indexes.some(
        (i) => i.name === baseStep.indexName && i.cols[0] === orderColName,
      );
    if (!matchesAccess) {
      const cost = Math.round(
        currentRows * Math.log2(Math.max(2, currentRows)),
      );
      result.steps.push({
        operation: "SORT",
        cost,
        outputRows: currentRows,
        description: `Sort ${currentRows} rows by ${parsed.orderBy.join(", ")}`,
      });
      result.totalCost += cost;
      result.insights.push(
        `ORDER BY ${parsed.orderBy.join(", ")} requires a sort — an index on the leading column would skip this`,
      );
    }
  }

  // LIMIT
  if (parsed.limit !== null) {
    result.steps.push({
      operation: "LIMIT",
      cost: 0,
      outputRows: Math.min(currentRows, parsed.limit),
      description: `Cap to ${parsed.limit} rows`,
    });
  }

  // Insights
  if (parsed.selectAll) {
    result.insights.push(
      `SELECT * pulls every column — narrow it down to reduce I/O and network bytes`,
    );
  }
  if (parsed.where.length === 0) {
    result.insights.push(`No WHERE filter — entire table will be returned`);
  }
  // Function-on-column check
  for (const w of parsed.where) {
    if (w.hasFunction) {
      result.insights.push(
        `WHERE applies a function to "${w.column}" — most engines can't use a regular index here`,
      );
    }
    if (w.operator === "LIKE" && w.isFullWildcard) {
      result.insights.push(
        `LIKE '%${(w.pattern || "").slice(1)}' begins with a wildcard — index unusable`,
      );
    }
    if (w.operator === "!=" || w.operator === "<>") {
      result.insights.push(
        `!= filters are rarely selective enough for an index lookup`,
      );
    }
  }
  if (parsed.joins.length > 0 && parsed.where.length === 0) {
    result.insights.push(
      `Joining without WHERE filters — full Cartesian explosion possible if no driving filter`,
    );
  }

  result.totalCost = Math.max(0, Math.round(result.totalCost));
  return result;
}

/* ═══════════════════════════════════════════════════════════════
   RENDER RESULTS
   ═══════════════════════════════════════════════════════════════ */
const VICTORY_LINES = [
  (q) => `${q} obliterates the competition.`,
  (q) => `${q} flexes hard. Optimizer approved.`,
  (q) => `${q} laughs at the other one's table scans.`,
  (q) => `${q} wins by a country mile.`,
  (q) => `Decisive — ${q} executes faster than the other one can sneeze.`,
  (q) => `${q} got the index memo. The other one didn't read it.`,
];
const NARROW_LINES = [
  (q) => `${q} edges ahead — barely.`,
  (q) => `${q} squeaks past the finish line.`,
  (q) => `Photo finish: ${q} by a hair.`,
];
const TIE_LINES = [
  () => `Dead heat. Either one will do.`,
  () => `Identical cost. Pick whichever you find prettier.`,
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderResults(resA, resB) {
  const root = document.getElementById("results-content");
  root.innerHTML = "";

  // Errors short-circuit
  const errorsA = resA.issues || [];
  const errorsB = resB.issues || [];
  if (!resA.valid || !resB.valid) {
    const banner = document.createElement("div");
    banner.className = "winner-banner error";
    banner.innerHTML = `<div class="label">// SYSTEM ERROR //</div><div class="winner" style="color:var(--warn);">PARSE FAILURE</div>`;
    const verdict = document.createElement("div");
    verdict.className = "verdict";
    verdict.style.color = "var(--warn)";
    const errs = [];
    if (!resA.valid) errs.push("Query A: " + errorsA.join(", "));
    if (!resB.valid) errs.push("Query B: " + errorsB.join(", "));
    verdict.textContent = errs.join(" • ");
    banner.appendChild(verdict);
    root.appendChild(banner);
    if (resA.valid) root.appendChild(buildResultCard("A", resA));
    if (resB.valid) root.appendChild(buildResultCard("B", resB));
    return;
  }

  // Winner banner
  const banner = document.createElement("div");
  banner.className = "winner-banner";
  let winnerLabel = "",
    winnerColor = "",
    verdict = "";
  if (resA.totalCost === resB.totalCost) {
    banner.classList.add("tie");
    winnerLabel = "TIE";
    winnerColor = "var(--neon-yellow)";
    verdict = pick(TIE_LINES)();
  } else {
    const aWins = resA.totalCost < resB.totalCost;
    const winner = aWins ? "A" : "B";
    const winnerCost = aWins ? resA.totalCost : resB.totalCost;
    const loserCost = aWins ? resB.totalCost : resA.totalCost;
    const ratio = winnerCost === 0 ? Infinity : loserCost / winnerCost;
    winnerLabel = `QUERY ${winner}`;
    winnerColor = aWins ? "var(--neon-magenta)" : "var(--neon-cyan)";
    if (ratio > 5 || ratio === Infinity)
      verdict = pick(VICTORY_LINES)(`Query ${winner}`);
    else if (ratio > 1.4)
      verdict = `Query ${winner} wins — roughly ${ratio.toFixed(1)}× cheaper.`;
    else verdict = pick(NARROW_LINES)(`Query ${winner}`);
    if (ratio !== Infinity && ratio > 1)
      verdict += ` (${ratio.toFixed(1)}× cost ratio)`;
  }
  banner.innerHTML = `<div class="label">// CHAMPION //</div>
    <div class="winner" style="color:${winnerColor};">${winnerLabel}</div>
    <div class="verdict">${verdict}</div>`;
  root.appendChild(banner);

  const grid = document.createElement("div");
  grid.className = "results-grid";
  grid.appendChild(buildResultCard("A", resA));
  grid.appendChild(buildResultCard("B", resB));
  root.appendChild(grid);
}

function buildResultCard(letter, res) {
  const card = document.createElement("div");
  card.className = "result-card " + letter.toLowerCase();
  card.innerHTML = `<div class="card-title">// QUERY ${letter}</div>
    <div class="cost-display">${formatCost(res.totalCost)}</div>
    <div class="cost-label">estimated cost units</div>`;

  const stepList = document.createElement("ul");
  stepList.className = "step-list";
  for (const step of res.steps) {
    const li = document.createElement("li");
    const opCls = (step.operation || "").replace(/[^A-Z]/gi, "-");
    li.innerHTML = `<span class="op ${opCls}">${step.operation}</span>
      <span class="cost-tag">${formatCost(step.cost || 0)}</span>
      <div>${step.description || ""}</div>
      <div style="color:var(--text-dim); font-size:0.78rem; margin-top:2px;">→ ~${formatCost(step.outputRows || 0)} rows out</div>`;
    stepList.appendChild(li);
  }
  card.appendChild(stepList);

  if (res.warnings.length || res.insights.length) {
    const ins = document.createElement("div");
    ins.className = "insights";
    for (const w of res.warnings) {
      const d = document.createElement("div");
      d.className = "warning";
      d.textContent = w;
      ins.appendChild(d);
    }
    for (const i of res.insights) {
      const d = document.createElement("div");
      d.className = "insight";
      d.textContent = i;
      ins.appendChild(d);
    }
    card.appendChild(ins);
  }
  return card;
}

function formatCost(n) {
  if (n === Infinity) return "∞";
  if (typeof n !== "number" || isNaN(n)) return "—";
  if (n < 1000) return Math.round(n).toString();
  if (n < 1e6) return (n / 1000).toFixed(1) + "k";
  if (n < 1e9) return (n / 1e6).toFixed(1) + "M";
  return (n / 1e9).toFixed(1) + "B";
}

/* ═══════════════════════════════════════════════════════════════
   EXECUTE BUTTON HANDLER
   ═══════════════════════════════════════════════════════════════ */
function runDuel() {
  const qa = document.getElementById("query-a").value;
  const qb = document.getElementById("query-b").value;
  const schemaIdx = buildSchemaIndex();

  const parsedA = parseSQL(qa);
  const parsedB = parseSQL(qb);
  const resA = estimateQuery(parsedA, schemaIdx);
  const resB = estimateQuery(parsedB, schemaIdx);

  // Reveal results with a brief "analyzing" beat
  const section = document.getElementById("results");
  const content = document.getElementById("results-content");
  section.classList.add("active");
  content.innerHTML = `<div class="typing">▌ANALYZING BYTECODE<span class="blink">_</span></div>`;
  section.scrollIntoView({ behavior: "smooth", block: "start" });

  setTimeout(() => {
    renderResults(resA, resB);
  }, 700);
}

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
document.getElementById("add-table-btn").onclick = () => {
  schemaState.push(newTable(""));
  renderSchema();
};
document.getElementById("clear-schema-btn").onclick = () => {
  if (confirm("Wipe the entire schema?")) {
    schemaState = [];
    renderSchema();
  }
};
document.getElementById("load-sample-btn").onclick = loadSampleSchema;
document.getElementById("execute-btn").onclick = runDuel;

// Sample queries
document.getElementById("query-a").value = `SELECT *
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.email LIKE '%@gmail.com'
ORDER BY o.created_at DESC;`;

document.getElementById("query-b").value = `SELECT u.id, u.name, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.email = 'specific@gmail.com'
  AND o.status = 'completed'
LIMIT 50;`;

// Boot
loadSampleSchema();
