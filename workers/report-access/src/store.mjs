// All read/check/write sequences are synchronous SQLite operations in one DO turn.
export class AccessStore {
  constructor(sql) {
    this.sql = sql;
    sql.exec(`CREATE TABLE IF NOT EXISTS challenge (id TEXT PRIMARY KEY, hash TEXT NOT NULL, expires INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, ready INTEGER NOT NULL DEFAULT 0, used INTEGER NOT NULL DEFAULT 0)`);
    sql.exec(`CREATE TABLE IF NOT EXISTS rate (id INTEGER PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL, last INTEGER NOT NULL)`);
    sql.exec(`CREATE TABLE IF NOT EXISTS lead (id INTEGER PRIMARY KEY, email TEXT NOT NULL, domain TEXT NOT NULL, verified_at TEXT NOT NULL)`);
  }

  rateLimit(limit, cooldown, now = Date.now()) {
    const row = this.sql.exec("SELECT * FROM rate WHERE id = 1").toArray()[0];
    if (row && row.until > now && (row.count >= limit || now - row.last < cooldown)) return false;
    const count = row && row.until > now ? row.count + 1 : 1;
    const until = row && row.until > now ? row.until : now + 15 * 60_000;
    this.sql.exec("INSERT OR REPLACE INTO rate VALUES (1, ?, ?, ?)", count, until, now);
    return true;
  }

  issue(id, hash, now = Date.now()) {
    if (!this.rateLimit(5, 60_000, now)) return null;
    this.sql.exec("DELETE FROM challenge");
    this.sql.exec("INSERT INTO challenge (id, hash, expires) VALUES (?, ?, ?)", id, hash, now + 600_000);
    return new Date(now + 600_000).toISOString();
  }

  delivered(id) {
    this.sql.exec("UPDATE challenge SET ready = 1 WHERE id = ?", id);
  }

  failed(id) {
    this.sql.exec("DELETE FROM challenge WHERE id = ?", id);
  }

  verify(id, hash, email, now = Date.now()) {
    const row = this.sql.exec("SELECT * FROM challenge WHERE id = ?", id).toArray()[0];
    if (!row || row.used || !row.ready || row.expires <= now) return "expired";
    if (row.attempts >= 5) return "locked";
    this.sql.exec("UPDATE challenge SET attempts = attempts + 1 WHERE id = ?", id);
    if (row.hash !== hash) return "incorrect";
    this.sql.exec("UPDATE challenge SET used = 1 WHERE id = ?", id);
    this.sql.exec("INSERT OR REPLACE INTO lead VALUES (1, ?, ?, ?)", email, email.split("@")[1], new Date(now).toISOString());
    return "verified";
  }

  cleanup(now = Date.now()) {
    this.sql.exec("DELETE FROM challenge WHERE expires <= ?", now);
    this.sql.exec("DELETE FROM rate WHERE until <= ?", now);
  }
}
