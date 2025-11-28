import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  // 👇 Thêm phần này để đổi port
  server: {
    port: 4000,       // muốn đổi sang port nào thì sửa ở đây
    host: true,       // tùy chọn: cho phép truy cập từ mạng LAN
  },
})
