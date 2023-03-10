import classNames from 'classnames'
import React from 'react'

interface Props {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  pageSize: number
}

const RANGE = 2
const Pagination = ({ page, setPage, pageSize }: Props) => {
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = (index: number) => {
      // ... chỉ show 1 lần ko phải ai cũng show
      if (!dotBefore) {
        dotBefore = true
        return (
          <button className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm' key={index}>
            ...
          </button>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      // ... chỉ show 1 lần ko phải ai cũng show
      if (!dotAfter) {
        dotAfter = true
        return (
          <button className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm' key={index}>
            ...
          </button>
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
          <button
            className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
              'border-cyan-500 ': page === pageNumber,
              'border-transparent': page !== pageNumber
            })}
            key={index}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      })
  }
  return (
    <div className='mt-6 flex flex-wrap items-center justify-center'>
      <button className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'>Prev</button>
      {renderPagination()}
      <button className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'>Next</button>
    </div>
  )
}

export default Pagination
