const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createProject,
  getProjects,
  getProjectByIdOrSlug,
  appreciateProject,
  getUserProjects,
} = require('../controllers/projectController');

const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/', getProjects);
router.get('/user/my-projects', authMiddleware, getUserProjects);
router.post('/:id/appreciate', authMiddleware, appreciateProject);
router.delete('/:id/appreciate', authMiddleware, appreciateProject);
router.get('/:slug', getProjectByIdOrSlug);

module.exports = router;
