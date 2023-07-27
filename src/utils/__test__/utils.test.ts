import { describe, it, expect } from 'vitest'
import { isAxiosError, isAxiosUnprocessableEntityError } from '../utils'
import { AxiosError } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
// describe dung de mo ta tap hop cac ngu canh hoac 1 don vi can test test: VD: function, component

describe('isAxiosError', () => {
  // it dung de ghi chu truong hop can test
  it('isAxiosError trả về boolean', () => {
    // expect dung de mong doi gia tri tra ve
    expect(isAxiosError(new Error())).toBe(false)
  })
})

describe('isAxiosUnprocessableEntityError', () => {
  it('isAxiosUnprocessableEntityError trả về boolean', () => {
    expect(isAxiosUnprocessableEntityError(new Error())).toBe(false)
    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError,
          data: null
        } as any)
      )
    ).toBe(false)
    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity,
          data: null
        } as any)
      )
    ).toBe(true)
  })
})
