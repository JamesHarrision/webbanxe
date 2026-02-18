import { PrismaClient, Prisma } from '@prisma/client'

// Cập nhật type để TypeScript hiểu rằng PrismaClient này có phát ra event 'query'
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient<Prisma.PrismaClientOptions, 'query'> | undefined
}

// Khởi tạo PrismaClient với cấu hình log
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' }, // Chuyển 'query' thành event để custom log
      { emit: 'stdout', level: 'info' }, // Các mức độ khác vẫn in thẳng ra console
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ],
  })

// Đăng ký sự kiện lắng nghe query
// Lưu ý: Chỉ đăng ký nếu biến global chưa tồn tại để tránh việc log bị lặp nhiều lần (duplicate listeners) mỗi khi Hot-reload
if (!globalForPrisma.prisma) {
  prisma.$on('query', (e) => {
    console.log('--- Prisma Query Log ---')
    console.log('Query:    ', e.query)
    console.log('Params:   ', e.params)
    console.log('Duration: ', e.duration + 'ms')
    console.log('------------------------\n')
  })
}

// Giữ lại connection trong môi trường Development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}