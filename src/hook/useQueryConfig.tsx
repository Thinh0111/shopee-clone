import { isUndefined, omitBy } from 'lodash'
import React from 'react'

import { QueryConfig } from 'src/pages/ProductList/ProductList'
import useQueryParams from './useQueryParams'

const useQueryConfig = () => {
  const queryParams: QueryConfig = useQueryParams()

  // loại bỏ những key nào nó thỏa mãn cái value của nó là undefined
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}

export default useQueryConfig
