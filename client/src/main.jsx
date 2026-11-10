import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const load = () => fetch("/api/posts").then((r) => r.json()).then(setPosts);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    // userId 1은 README 「처음 한 번」 5에서 넣은 회원이다. 없으면 서버가 실패를 돌려준다.
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, title, content }),
    });
    if (!res.ok) {
      setError(`글을 저장하지 못했습니다(HTTP ${res.status}). 서버 터미널의 오류를 확인하세요.`);
      return;
    }
    setTitle("");
    setContent("");
    load();
  };

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>팀 게시판</h1>
      <form onSubmit={submit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" required />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" required />
        <button>글쓰기</button>
      </form>
      {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}
      <ul>
        {posts.map((p) => (
          <li key={p.id}><strong>{p.title}</strong> · {p.author}</li>
        ))}
      </ul>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
