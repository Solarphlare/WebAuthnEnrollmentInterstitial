import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/interstitials/",
  server: {
    host: "loopback.cominatyou.com",
    https: {
      key: fs.readFileSync('C:\\Users\\willi\\Documents\\dev\\loopback-certs\\loopback-key.pem'),
      cert: fs.readFileSync('C:\\Users\\willi\\Documents\\dev\\loopback-certs\\fullchain.pem')
    }
  }
})
