import express from 'express';
import { t } from '../trpc';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();
export const indexRouter = express.Router();

export const appRouter = t.router({
  // 根据id查询用户
  getUserById: t.procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return prisma.user.findUnique({
      where: { id: input.id },
    });
  }),

  // 根据用户名查询用户
  getUserByName: t.procedure.input(z.object({ name: z.string() })).query(async ({ input }) => {
    return prisma.user.findFirst({
      where: { name: input.name! },
    });
  }),

  // 查询所有用户信息
  getUserAll: t.procedure.query(async () => {
    return prisma.user.findMany();
  }),

  // 分页查询用户信息
  getUserByPage: t.procedure.input(z.object({ page: z.number(), size: z.number() })).query(async ({ input }) => {
    // 获取分页数据
    const userData = await prisma.user.findMany({
      skip: (input.page - 1) * input.size,
      take: input.size,
      orderBy: {
        id: 'desc',
      },
    });
    const totalCount = await prisma.user.count();
    return {
      total: totalCount,
      userList: userData,
    };
  }),

  // 根据id修改指定用户信息
  updateUserById: t.procedure
    .input(z.object({ id: z.number(), name: z.string(), password: z.string(), roleId: z.number() }))
    .mutation(async ({ input }) => {
      return prisma.user.update({
        where: { id: input.id },
        data: input,
      });
    }),

  // 根据id删除指定用户信息
  deleteUserById: t.procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return prisma.user.delete({
      where: { id: input.id },
    });
  }),

  // 新增用户信息
  addUser: t.procedure
    .input(z.object({ name: z.string(), password: z.string(), roleId: z.number() }))
    .mutation(async ({ input }) => {
      return prisma.user.create({
        data: input,
      });
    }),

  // 根据需要数目查询新闻动态
  getNewsByNum: t.procedure.input(z.object({ num: z.number() })).query(async ({ input }) => {
    return prisma.news.findMany({
      take: input.num,
    });
  }),

  // 分页查询新闻动态
  getNewsByPage: t.procedure.input(z.object({ page: z.number(), size: z.number() })).query(async ({ input }) => {
    // 获取分页数据
    const newsData = await prisma.news.findMany({
      skip: (input.page - 1) * input.size,
      take: input.size,
      orderBy: {
        id: 'desc',
      },
    });
    // 获取总数量
    const totalCount = await prisma.news.count();
    // 返回分页数据和总数量
    return {
      total: totalCount,
      newsList: newsData,
    };
  }),

  // 根据id查询新闻动态
  getNewsById: t.procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return prisma.news.findUnique({
      where: { id: input.id },
    });
  }),

  // 根据id删除新闻动态
  deleteNewById: t.procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return prisma.news.delete({
      where: { id: input.id },
    });
  }),

  // 新增新闻动态
  addNews: t.procedure
    .input(z.object({ title: z.string(), desc: z.string(), imgUrl: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.news.create({
        data: input,
      });
    }),

  // 根据id修改指定新闻动态
  updateNewsById: t.procedure
    .input(z.object({ id: z.number(), title: z.string(), desc: z.string(), imgUrl: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.news.update({
        where: { id: input.id },
        data: input,
      });
    }),

  // 根据id修改列表
  updateListById: t.procedure
    .input(z.object({ id: z.number(), title: z.string(), desc: z.string(), imgUrl: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.list.update({
        where: { id: input.id },
        data: input,
      });
    }),

  // 根据需求数目查询列表
  getListByNum: t.procedure.input(z.object({ num: z.number() })).query(async ({ input }) => {
    return prisma.list.findMany({
      take: input.num,
    });
  }),

  // 分页查询列表
  getListByPage: t.procedure.input(z.object({ page: z.number(), size: z.number() })).query(async ({ input }) => {
    const listData = await prisma.list.findMany({
      skip: (input.page - 1) * input.size,
      take: input.size,
      orderBy: {
        id: 'desc',
      },
    });
    const totalCount = await prisma.list.count();
    return {
      total: totalCount,
      list: listData,
    };
  }),

  // 根据id查询列表
  getListById: t.procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return prisma.list.findUnique({
      where: { id: input.id },
    });
  }),

  // 删除列表项
  deleteListById: t.procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return prisma.list.delete({
      where: { id: input.id },
    });
  }),

  // 新增列表项
  addList: t.procedure
    .input(z.object({ title: z.string(), desc: z.string(), imgUrl: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.list.create({
        data: input,
      });
    }),

  // 新增订单
  addOrder: t.procedure
    .input(
      z.object({
        name: z.string(),
        gender: z.string(),
        email: z.string().email(),
        tel: z.string(),
        serviceType: z.string(),
        specifications: z.string(),
        date: z.string(), // Zod 目前不直接支持 DateTime 类型，需要使用字符串格式
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.order.create({
        data: input,
      });
    }),

  // 根据id删除订单
  deleteOrderById: t.procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return prisma.order.delete({
      where: { id: input.id },
    });
  }),

  // 根据id更新订单
  updateOrderById: t.procedure
    .input(
      z.object({
        id: z.number().int().optional(), // 通常 ID 是自动生成的，因此可以是可选的
        name: z.string(),
        gender: z.string(),
        email: z.string().email(),
        tel: z.string(),
        serviceType: z.string(),
        specifications: z.string(),
        date: z.string(), // Zod 目前不直接支持 DateTime 类型，需要使用字符串格式
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.order.update({
        where: { id: input.id },
        data: input,
      });
    }),

  // 根据id查询订单
  getOrderById: t.procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return prisma.order.findUnique({
      where: { id: input.id },
    });
  }),

  // 分页查询订单
  getOrderByPage: t.procedure.input(z.object({ page: z.number(), size: z.number() })).query(async ({ input }) => {
    const orderData = await prisma.order.findMany({
      skip: (input.page - 1) * input.size,
      take: input.size,
      orderBy: {
        id: 'desc',
      },
    });
    const totalCount = await prisma.order.count();
    return {
      total: totalCount,
      list: orderData,
    };
  }),

  // 查询菜单列表
  getMenuList: t.procedure.query(async () => {
    return [
      {
        path: '/news',
        name: 'news',
        component: 'LAYOUT',
        redirect: '/news/news',
        meta: {
          title: {
            zh_CN: '新闻动态',
            en_US: 'news',
          },
          icon: 'root-list',
        },
        children: [
          {
            path: 'news',
            name: 'news',
            component: '/news/news/index',
            meta: {
              title: {
                zh_CN: '新闻动态管理',
                en_US: 'Base List',
              },
            },
          },
        ],
      },
      {
        path: '/list',
        name: 'list',
        component: 'LAYOUT',
        redirect: '/list/list',
        meta: {
          title: {
            zh_CN: '项目列表',
            en_US: 'List',
          },
          icon: 'table-1',
        },
        children: [
          {
            path: 'list',
            name: 'list',
            component: '/list/list/index',
            meta: {
              title: {
                zh_CN: '项目列表管理',
                en_US: 'Base List',
              },
            },
          },
        ],
      },
      {
        path: '/user',
        name: 'user',
        component: 'LAYOUT',
        redirect: '/user/table',
        meta: {
          title: {
            zh_CN: '用户管理',
            en_US: 'List',
          },
          icon: 'user-1',
        },
        children: [
          {
            path: 'table',
            name: 'table',
            component: '/user/table',
            meta: {
              title: {
                zh_CN: '用户管理',
                en_US: 'Base List',
              },
            },
          },
        ],
      },
      {
        path: '/order',
        name: 'order',
        component: 'LAYOUT',
        redirect: '/order/index',
        meta: {
          title: {
            zh_CN: '预约订单',
            en_US: 'List',
          },
          icon: 'order-descending',
        },
        children: [
          {
            path: 'index',
            name: 'order',
            component: '/order/index',
            meta: {
              title: {
                zh_CN: '订单管理',
                en_US: 'Base List',
              },
            },
          },
        ],
      },
    ];
  }),
});

// 上传图片
indexRouter.post('/upload', (req, res) => {
  // 设置存储路径和文件名
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets/news/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  // 设置文件大小和格式限制
  const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000 }, // 限制文件大小为 3MB
    fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Error: Images Only!'));
      }
    },
  }).single('file');
  // 处理请求
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({
        status: 400,
        data: [],
        message: err.message,
      });
    } else if (err) {
      res.status(500).json({
        status: 500,
        data: [],
        message: err.message,
      });
    } else {
      if (req.file === undefined) {
        res.status(400).json({
          status: 400,
          data: [],
          message: '未选中该图片',
        });
      } else {
        const imgUrl = '/assets/news/' + req.file.filename;
        res.status(200).json({
          status: 200,
          data: {
            imgUrl,
          },
          message: '图片上传成功',
        });
      }
    }
  });
});

export type AppRouter = typeof appRouter;
