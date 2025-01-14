const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', inventoryController.getAllItems);
router.post('/', inventoryController.createItem);
router.put('/:id', inventoryController.updateItem);
router.delete('/:id', inventoryController.deleteItem);
router.get('/export', inventoryController.exportCsv);
router.post('/import', upload.single('file'), inventoryController.importCsv);

module.exports = router; 