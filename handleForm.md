> Khi ta nhấn submit thì nó re render

### watch

- watch: là method nó sẽ lắng nghe cái input change nó sẽ re render lại component của chúng ta
  khi input change.
  `const  formValues = watch()`

- Khi watch ko truyền tham số gì cả thì mỗi lần input bất kỳ cái nào thì nó cũng re render. Nếu truyền `email` thôi `const email = watch('email')` thì mỗi lần input email thì nó mới re render và value nhận đc là email. Nếu mình input vào password thì nó ko re render.

- Việc sử dụng `watch` thì ta lắng nghe input nó change. Mỗi lần nó change component re render. Bây giờ nó cung cấp cho ta 1 method đó là `getValues` dùng mà ko làm component chúng ta re render.

### handleSubmit

- khi nhấn submit cái form của ta ko đúng thì function handleSubmit ko chạy. Thì có handleSubmit khi hover thì thấy nó nhận vào 2 cái 1 cái là onValid (là 1 callback nó chạy khi form nó đúng), onInvalid(nó chạy khi form ta ko đúng, cái này là 1 option thôi có cũng đc ko có cũng đc)

## Format lỗi

### Trong trường hợp lỗi 422 (thường do form) hoặc lỗi do truyền query / params bị sai

Ví dụ đăng ký email đã tồn tại

```json
{
  "message": "Lỗi",
  "data": {
    "email": "Email đã tồn tại"
  }
}
```

### Trong trường hợp lỗi còn lại

<!-- trường hợp data xử lý lỗi ko trả về cho ta message thì ta cần phải handle việc đó -->

```json
{
  "message": "Lỗi do abcxyz"
}
```

### Cách tính sao

Ví dụ: rating = 3.4

- 1 <= 3.4 => 100%
- 2 <= 3.4 => 100%
- 3 <= 3.4 => 100%
- 4 > 3.4 => 40% (4 - 3.4 < 1) (phần trăm này là số thập phân)
- 5 > 3.4 => 0% (5 - 3.4 > 1)
