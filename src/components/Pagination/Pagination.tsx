import classNames from 'classnames'
import React from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/pages/ProductList/ProductList'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2
const Pagination = ({ queryConfig, pageSize }: Props) => {
  // convert qua Number vì page trong queryConfig là string
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = (index: number) => {
      // ... chỉ show 1 lần ko phải ai cũng show
      if (!dotBefore) {
        dotBefore = true
        return (
          <span className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm' key={index}>
            ...
          </span>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      // ... chỉ show 1 lần ko phải ai cũng show
      if (!dotAfter) {
        dotAfter = true
        return (
          <span className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm' key={index}>
            ...
          </span>
        )
      }
      return null
    }

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        // page = 1 && RANGE = 2 && PageSize = 20 && PageNumber = 20
        // 1 < 5 && 1 > 3 && 1 < 17 x
        // 1 < 5 && 2 > 3 && 2 < 16 x
        // 1 < 5 && 3 > 3 && 3 < 15 x
        // 1 < 5 && 4 > 3 && 4 < 14 ok
        // 1 < 5 && 5 > 3 && 5 < 13 ok

        //* Điều kiện để return về ...
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          // sau page hiện tại là dot after
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }

        return (
          // Nếu page === pageNumber thì active với border-cyan-500 còn ko thì ko active với border-transparent
          <Link
            to={{
              pathname: path.home,

              // createSearchParams nó return về 1 URLSearchParams còn search nó return về 1 string chính vì vậy phải toString()
              search: createSearchParams({
                ...queryConfig,

                // pageNumber.toString() để convert qua string
                page: pageNumber.toString()
              }).toString()
            }}
            className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
              'border-cyan-500 ': page === pageNumber,
              'border-transparent': page !== pageNumber
            })}
            key={index}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='mt-6 flex flex-wrap items-center justify-center'>
      {page === 1 ? (
        // Nếu page === 1 thì Prev là span để ko click đc
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2 shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
        >
          Prev
        </Link>
      )}

      {renderPagination()}
      {page === pageSize ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2 shadow-sm'>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
        >
          Next
        </Link>
      )}
    </div>
  )
}

export default Pagination
