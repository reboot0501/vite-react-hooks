### useLayoutEffect 와 useEffect  차이

- useLayoutEffect : 컴포넌트가 화면이 그려지기 이전에 effect가 동기적으로 실행 
- useEffect : 컴포넌트가 화면이 그려진 후 effect 비동기적으로 실행

### useLayoutEffect 언제 사용해야 하나?

- 컴포넌트가 배치되기 전에 layout 이나 scroll 같은 UI 적인 계산이 필요 한 경우
