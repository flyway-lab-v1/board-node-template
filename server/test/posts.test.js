import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { createApp } from "../src/app.js";

// 테스트는 개발 DB(board)가 아니라 board_test를 새로 만들어 쓴다.
const TEST_DB = `${process.env.DB_NAME}_test`;
const conn = {
  host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
};
let pool, server, base;

before(async () => {
  const admin = await mysql.createConnection(conn);
  await admin.query(`DROP DATABASE IF EXISTS \`${TEST_DB}\``);
  await admin.query(`CREATE DATABASE \`${TEST_DB}\``);
  await admin.end();
  // 팀과 같은 마이그레이션 파일로 테스트 DB를 만든다
  execFileSync("flyway", [
    `-url=jdbc:mysql://${conn.host}:${conn.port}/${TEST_DB}?allowPublicKeyRetrieval=true`,
    "migrate",
  ], { cwd: fileURLToPath(new URL("../..", import.meta.url)), shell: true, stdio: "ignore" });
  pool = mysql.createPool({ ...conn, database: TEST_DB });
  await pool.query("INSERT INTO users (email, name) VALUES ('kim@example.com', '김팀원')");
  server = createApp(pool).listen(0);
  base = `http://localhost:${server.address().port}`;
});

after(async () => {
  server?.close();
  await pool?.end();
});

test("글을 작성하면 201과 새 id를 돌려준다", async () => {
  const res = await fetch(`${base}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 1, title: "첫 글", content: "안녕하세요" }),
  });
  assert.equal(res.status, 201);
  assert.equal(typeof (await res.json()).id, "number");
});

test("글 목록은 작성자 이름과 함께 최신순으로 나온다", async () => {
  const res = await fetch(`${base}/api/posts`);
  assert.equal(res.status, 200);
  const posts = await res.json();
  assert.equal(posts.length, 1);
  assert.equal(posts[0].title, "첫 글");
  assert.equal(posts[0].author, "김팀원");
});

test("제목이 없으면 400을 돌려준다", async () => {
  const res = await fetch(`${base}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 1, content: "제목 없음" }),
  });
  assert.equal(res.status, 400);
});
