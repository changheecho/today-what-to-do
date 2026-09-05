# 오늘 뭐 하지?

- `src/features`에는 즐겨찾기, 주말 필터, ICS 내려받기 확장 기능을 독립적으로 둔다.
- 실행: `npm install` 후 `npm run dev` / 검증: `npm test`, `npm run typecheck`, `npm run build`
- 기능은 자기 폴더 밖을 가급적 수정하지 않는다. 공통 연결은 props와 인터페이스로 처리한다.
