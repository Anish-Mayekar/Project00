const express = require('express');
const { createPreparation, getPreparationByFarmer, updatePreparation, deletePreparation, getAllPreparations  } = require('../controllers/PrepStage.controller');
const router = express.Router();

router.post('/prep', createPreparation);
router.get('/', getAllPreparations);
router.get('/:farmerId', getPreparationByFarmer);
router.put('/:farmerId', updatePreparation);
router.delete('/:farmerId', deletePreparation);

module.exports = router;