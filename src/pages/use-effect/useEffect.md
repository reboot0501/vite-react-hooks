## Component 생성 , 변경, 소멸 주기에 따른 제어 Hooks 

### useEffect 패턴

**- 콤포넌트가 랜더링될때 무조건 작업 실행**
```typescript
useEffect(() => { 
    // 작업 
  })
```

**- 콤포넌트가 랜더링될때 한번만 작업 실행**
```typescript
useEffect(() => { 
    // 작업 
  }, [])
```

**- 특정 state가 변경될때만 작업이 실행되는 함수를 등록**
```typescript
  useEffect(() => { 
    // 작업 
  }, [작업이 실행될 state])
```

**- 컴포넌트가 소멸될때 실행되는 함수를 등록**
```typescript
  useEffect(() => { 
    // 구독 작업 
    return () => {
      // 구독 해지 작업
    }
  }, [])
```