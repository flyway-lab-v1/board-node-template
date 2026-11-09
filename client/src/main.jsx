import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const load = () => fetch("/api/posts").then((r) => r.json()).then(setPosts);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, title, content }),
    });
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
      <ul>
        {posts.map((p) => (
          <li key={p.id}><strong>{p.title}</strong> · {p.author}</li>
        ))}
      </ul>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
