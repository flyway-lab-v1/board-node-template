CREATE TABLE posts (
  id         BIGINT       NOT NULL AUTO_INCREMENT,
  user_id    BIGINT       NOT NULL,
  title      VARCHAR(200) NOT NULL,
  content    TEXT         NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users (id)
);
