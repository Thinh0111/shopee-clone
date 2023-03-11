import React from 'react'
import { useQuery } from 'react-query'
import productApi from 'src/api/product.api'
import Pagination from 'src/components/Pagination'
import useQueryParams from 'src/hook/useQueryParams'
import { ProductListConfig } from 'src/types/product.types'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'
import { omitBy, isUndefined } from 'lodash'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

const ProductList = () => {
  const queryParams: QueryConfig = useQueryParams()

  // loại bỏ những key nào nó thỏa mãn cái value của nó là undefined
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit,
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter
    },
    isUndefined
  )

  const { data } = useQuery({
    // truyền queryParams trên queryKey này để khi queryParams thay đổi thì nó sẽ gọi lại API
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig as ProductListConfig)
    },

    // khi mình chuyển trang nó bị giựt, data ban đầu là undefined sau mới có data. Khi chuyển trang useQuery sẽ gọi lại API và data bị xét lại là undefined. Thì ban đầu có dữ liệu mà nó bị undefined nên nó bị giựt. Để data ko bị mất đi từ data cũ (ta chỉ cập nhập data mới thôi) ta sử dụng keepPreviousData: true là đc nó chỉ cập nhật lại thôi từ data cũ nó ko reset lại undefined
    keepPreviousData: true
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {data && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter />
            </div>
            <div className='col-span-9'>
              <SortProductList />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {data.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
