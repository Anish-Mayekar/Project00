const express = require('express');
const { createSowing, getSowingByFarmer, getAllSowing, updateSowing, deleteSowing } = require('../controllers/SowingStage.controller');
const router = express.Router();

router.post('/', createSowing);
router.get('/', getAllSowing);
router.get('/:farmerId', getSowingByFarmer);
router.put('/:id', updateSowing);
router.delete('/:id', deleteSowing);

module.exports = router;