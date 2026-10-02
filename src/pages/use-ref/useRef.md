## 형식
```typescript
const ref = useRef(value)
```
ref --> { current: value }

**반환 된 ref 는 컴포넌트 전 생애 주기를 통해 유지 되는 변수**

### 1. 어떠한 값을 저장 할 수 있는 공간
- 함수 형 콤포넌는 state 변화 ➡️ 랜더링  ➡️ 콤포넌트 내부 변수들 초기화 
### 2. Ref 의 변화 ➡️ No Rendering ➡️ 변수 값 들이 유지됨
### 3. State 변화 ➡️ Rendering ➡️ Ref 의 값은 그대로 유지됨
### 4. DOM 요소에 직접 접근

