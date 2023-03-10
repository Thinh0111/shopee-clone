// Thêm as const thì cái const chỉ đọc được thôi (ko có ghi, chỉnh sửa được)
export const sortBy = {
  createAt: 'createdAt',
  view: 'view',
  sold: 'sold',
  price: 'price'
} as const

export const order = {
  asc: 'asc',
  desc: 'desc'
} as const
