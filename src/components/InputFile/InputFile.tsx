import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  onChange?: (file?: File) => void
}

const InputFile = ({ onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    // Khi click vào button làm cho thẻ input click
    fileInputRef.current?.click()
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ chọn 1 file thôi
    const fileFromLocal = event.target.files?.[0]
    fileInputRef.current?.setAttribute('value', '')

    // Nếu fileFromLocal có size lớn hơn 1MB hoặc không có type là image thì báo lỗi
    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error(`Dụng lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG`, {
        position: 'top-center'
      })
    } else {
      onChange && onChange(fileFromLocal)
    }
  }
  return (
    <>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // Khi chọn 1 tấm ảnh thì cái file của tấm ảnh đấy nó đã được lưu trong cái value input file này rồi nên chọn lại 1 tấm ảnh y hệt tấm ảnh cũ thì cái onChange này sẽ không chạy (vì chọn giống nhau 1 tấm ảnh thì ko gọi cái onChange nên ko kích hoạt).
          ;(event.target as any).value = null
        }}
      />
      <button
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        type='button'
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </>
  )
}

export default InputFile
