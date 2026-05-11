import { can } from '@/access/rbac.config'

export const SliderImagesAccess = {
  create: ({ req }) => can(req.user.role, 'SliderImages', 'create'),
  read: ({ req }) => can(req.user.role, 'SliderImages', 'read'),
  update: ({ req }) => can(req.user.role, 'SliderImages', 'update'),
  delete: ({ req }) => can(req.user.role, 'SliderImages', 'delete'),
}