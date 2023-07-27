import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearLocalStorage,
  setRefreshTokenToLocalStorage,
  saveAccessTokenToLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage
} from '../auth'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGZkNWViNmQ3YzYyMDM0MDg1YmVjYiIsImVtYWlsIjoiSGVsbG9Xb3JsZDEyM0BnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA3LTI3VDE1OjU2OjU5LjY2MVoiLCJpYXQiOjE2OTA0NzM0MTksImV4cCI6MTY5MDU1OTgxOX0.yESEcjpe4vsy1VfJx_mENJvnoo6_7NfkRTNGh_5TRAI'

const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNzRhNjExNWZkYzVmMDM3ZTZmNjk0YiIsImVtYWlsIjoiZDdAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMi0xMi0xMlQwODoxMjo1NS4xOTZaIiwiaWF0IjoxNjcwODMyNzc1LCJleHAiOjE2ODQ2NTY3NzV9.exhtfRyvl2Z5uAAfEQKtIyyUhP8q-K5wvHvHpWZz128'

beforeEach(() => {
  localStorage.clear()
})

describe('access_token', () => {
  it('access_token được set vào localStorage', () => {
    saveAccessTokenToLocalStorage(access_token)
    expect(getAccessTokenFromLocalStorage()).toBe(access_token)
  })
})

describe('refresh_token', () => {
  it('refresh_token được set vào localStorage', () => {
    setRefreshTokenToLocalStorage(refresh_token)
    expect(getRefreshTokenFromLocalStorage()).toEqual(refresh_token)
  })
})

describe('clearLS', () => {
  it('Xóa hết access_token, refresh_token, profile', () => {
    setRefreshTokenToLocalStorage(refresh_token)
    saveAccessTokenToLocalStorage(access_token)
    // setProfile tại đây
    // ...
    clearLocalStorage()
    expect(getAccessTokenFromLocalStorage()).toBe('')
    expect(getRefreshTokenFromLocalStorage()).toBe('')
  })
})
