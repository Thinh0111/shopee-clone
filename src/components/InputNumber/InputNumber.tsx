import React, { forwardRef, useState } from 'react'
import { InputHTMLAttributes } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1rem] text-sm text-red-600',
    onChange,
    value,
    ...rest
  },
  ref
) {
  // Trường hợp người dùng ko truyền onChange hay value thì input number nhập được chữ như này không hay mong muốn dù người dùng ko có truyền vào onChange hay value vào thì nó vẫn hoạt động đúng những gì mình set up logic trong đấy
  // Trường hợp người dùng ko truyền onChange hay value vào thì mình sẽ sử dụng component InputNumber như sau sẽ tạo 1 state cục bộ
  // Nếu người dùng truyền value vào thì lấy giá trị value trên này làm giá trị khởi tạo.(giá trị khởi tạo này chỉ hiệu nghiệm 1 lần redner đầu tiên thôi, nếu value thay đổi nó sẽ ko làm giá trị khởi tạo này thay đổi)
  const [localValue, setLocalValue] = useState<string>(value as string)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    // reges kiểm tra số
    if (/^\d*$/.test(value) || value === '') {
      // Khi nhập số thì onChange mới chạy, còn nhập text thì onChange sẽ không chạy
      // bên này xuất ra event bên nhận sẽ nhận event, bên này xuất ra value bên nhận sẽ nhận value
      // Thực thi onchange callback từ bên ngoài truyền vào props
      onChange && onChange(e)

      // Cập nhật localValue  state
      setLocalValue(value)
    }
  }
  return (
    <>
      <div className={className}>
        <input
          className={classNameInput}
          onChange={handleChange}
          value={value === undefined ? localValue : value}
          {...rest}
          ref={ref}
        />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    </>
  )
})

export default InputNumber
