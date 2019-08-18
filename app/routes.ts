import { Router } from 'express'
import UserController from './controllers/UserController'
import StudentController from './controllers/StudentController'
import LectureController from './controllers/LectureController'

const routes = Router()

routes.get('/users', UserController.index)
routes.post('/users/create', UserController.store)
routes.delete('/users', UserController.destroy)

routes.get('/students', StudentController.index)
routes.post('/students/create', StudentController.store)
routes.delete('/students', StudentController.destroy)

routes.get('/lectures', LectureController.index)
routes.post('/lectures/create', LectureController.store)
routes.delete('/lectures', LectureController.destroy)
export default routes