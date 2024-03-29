import { useQuery } from 'react-query'
import productApi from 'src/api/product.api'
import Pagination from 'src/components/Pagination'

import { ProductListConfig } from 'src/types/product.types'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product'
import SortProductList from './components/SortProductList'

import categoryApi from 'src/api/category.api'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import useQueryConfig from 'src/hook/useQueryConfig'
import { Helmet } from 'react-helmet-async'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

const ProductList = () => {
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()

  const { data: productData } = useQuery({
    // truyền queryParams trên queryKey này để khi queryParams thay đổi thì nó sẽ gọi lại API
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig as ProductListConfig)
    },
    onSuccess: (data) => {
      // nếu page 1 mà length 0 nó lặp hoài
      if (data.data.data.products.length === 0 && data.data.data.pagination.page !== 1) {
        return navigate({
          pathname: path.home,
          search: createSearchParams({
            ...queryConfig,
            page: '1'
          }).toString()
        })
      }
    },

    // khi mình chuyển trang nó bị giựt, data ban đầu là undefined sau mới có data. Khi chuyển trang useQuery sẽ gọi lại API và data bị xét lại là undefined. Thì ban đầu có dữ liệu mà nó bị undefined nên nó bị giựt. Để data ko bị mất đi từ data cũ (ta chỉ cập nhập data mới thôi) ta sử dụng keepPreviousData: true là đc nó chỉ cập nhật lại thôi từ data cũ nó ko reset lại undefined
    keepPreviousData: true,

    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>Trang chủ</title>
        <meta name='description' content='Trang chủ của Shopee clone' />
      </Helmet>
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              {/* Nếu nó undefined thì lấy array rỗng */}
              <AsideFilter categories={categoriesData?.data.data || []} queryConfig={queryConfig} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
