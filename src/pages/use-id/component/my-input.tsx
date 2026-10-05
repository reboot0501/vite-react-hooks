// src/pages/use-id/component/my-input.tsx


const MyInput = ({ id, label }: { id: string, label: string }) => {

  console.log(`id = ${id}, label = ${label}`);
  
  return (
    <div>
      {/* label 을 클릭하면 input 요소에 포커스가 이동합니다 */}
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
      
    </div>
  )
}

export default MyInput