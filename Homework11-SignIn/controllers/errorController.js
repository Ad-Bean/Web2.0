const validation = [
  {
    field: "username",
    validator: (v) => !!v && v.match(/^([a-zA-Z])([a-zA-Z0-9_]){5,17}$/g),
    message: "用户名格式错误",
  },
  {
    field: "password",
    validator: (v) => !!v && v.match(/^[a-zA-Z0-9_\-]{6,12}$/g),
    message: "密码格式错误",
  },
  {
    field: "number",
    validator: (v) => !!v && v.match(/^(?!0)[0-9]{8}$/g),
    message: "学号格式错误",
  },
  {
    field: "phone",
    validator: (v) => !!v && v.match(/^(?!0)[0-9]{11}$/g),
    message: "电话格式错误",
  },
  {
    field: "email",
    validator: (v) =>
      !!v &&
      v.match(/^[a-zA-Z0-9]+@[a-z0-9]+.*?\.[a-zA-Z\u4e00-\u9fa5]{2,4}$/g),
    message: "邮箱格式错误",
  },
];

module.exports = validation;
