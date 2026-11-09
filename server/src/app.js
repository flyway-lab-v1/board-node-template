import express from "express";

// pool: mysql2/promise 커넥션 풀. 테이블은 Flyway 마이그레이션(db/migration)이 만든다.
export function createApp(pool) {
  const app = express();
  app.use(express.json());

  app.get("/api/posts", async (req, res) => {
    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.content, p.created_at AS createdAt, u.name AS author
         FROM posts p JOIN users u ON u.id = p.user_id
        ORDER BY p.id DESC`
    );
    res.json(rows);
  });

  app.post("/api/posts", async (req, res) => {
    const { userId, title, content } = req.body ?? {};
    if (!userId || !title || !content) {
      return res.status(400).json({ message: "userId, title, content는 필수입니다" });
    }
    const [result] = await pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
      [userId, title, content]
    );
    res.status(201).json({ id: result.insertId });
  });

  return app;
}
