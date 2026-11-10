# 팀 게시판 (React + Express + MySQL + Flyway)

팀 프로젝트 연습용 템플릿 저장소입니다. DB 테이블은 `db/migration`의 Flyway 마이그레이션 파일로만 만들고 바꿉니다.

## 처음 한 번

1. `flyway.toml.example`을 복사해 `flyway.toml`을 만들고 `CHANGE_ME`를 내 MySQL 비밀번호로 바꿉니다.
2. `server/.env.example`을 복사해 `server/.env`를 만들고 같은 비밀번호를 적습니다.
3. 두 파일은 `.gitignore`에 들어 있어서 Git에 올라가지 않습니다.
4. 의존성을 설치합니다: `npm install --prefix server`, `npm install --prefix client`
5. `npm run db:migrate`로 테이블을 만든 뒤, 화면에서 글을 쓸 회원 한 명을 넣습니다. 마이그레이션은 빈 `users` 테이블만 만들고, 화면은 `userId: 1`로 글을 씁니다.
   ```sql
   INSERT INTO users (email, name) VALUES ('me@example.com', '나');
   ```
   MySQL에 접속해 `USE board;` 다음에 실행합니다. 회원이 없으면 글쓰기 아래에 「글을 저장하지 못했습니다」가 보입니다.

## 매일 쓰는 명령

| 명령 | 하는 일 |
|------|--------|
| `npm run db:migrate` | 아직 적용하지 않은 마이그레이션을 내 DB에 적용 |
| `npm run db:info` | 적용된 마이그레이션과 남은 마이그레이션 목록 |
| `npm run db:validate` | 내 DB 기록과 파일이 일치하는지 검사 |
| `npm run server` | Express 서버 (http://localhost:3000) |
| `npm run client` | React 화면 (http://localhost:5173) |
| `npm test` | 서버 테스트 (`board_test` DB를 새로 만들어 검사) |

## 마이그레이션 파일 규칙

- 이름: `V` + 연월일시분초 14자리 + `__` + 영어 소문자·밑줄 설명 + `.sql`
  예: `V20261109143005__add_nickname_to_users.sql`
- 한 번 적용(병합)한 파일은 고치지 않습니다. 바꿀 내용은 새 파일로 만듭니다.
- 테이블·컬럼 이름은 소문자와 밑줄만 씁니다.

자세한 절차는 팀 협업 가이드(노션)를 보세요.
