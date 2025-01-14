const Inventory = require('../models/Inventory');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find().populate('supplier');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    const savedItem = await newItem.save();
    const populatedItem = await savedItem.populate('supplier');
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('supplier');
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.importCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const items = [];
    const errors = [];
    let rowNumber = 1;

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
          rowNumber++;
          try {
            items.push({
              name: row.name,
              quantity: parseInt(row.quantity),
              category: row.category,
              lowStockThreshold: parseInt(row.lowStockThreshold),
              supplier: row.supplierId
            });
          } catch (error) {
            errors.push(`Error in row ${rowNumber}: ${error.message}`);
          }
        })
        .on('end', async () => {
          try {
            if (errors.length > 0) {
              reject(new Error(errors.join('\n')));
              return;
            }

            // Validate all items before inserting
            const validationErrors = items
              .map((item, index) => {
                if (!item.name) return `Row ${index + 2}: Name is required`;
                if (isNaN(item.quantity)) return `Row ${index + 2}: Invalid quantity`;
                if (!item.category) return `Row ${index + 2}: Category is required`;
                if (isNaN(item.lowStockThreshold)) return `Row ${index + 2}: Invalid threshold`;
                return null;
              })
              .filter(error => error !== null);

            if (validationErrors.length > 0) {
              reject(new Error(validationErrors.join('\n')));
              return;
            }

            resolve();
          } catch (error) {
            reject(error);
          }
        });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportCsv = async (req, res) => {
  try {
    const items = await Inventory.find().populate('supplier');
    
    // Create CSV data
    const csvData = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      lowStockThreshold: item.lowStockThreshold,
      supplier: item.supplier?.name || '',
      supplierId: item.supplier?._id || ''
    }));

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const filename = path.join(tempDir, `inventory-${Date.now()}.csv`);
    
    // Write CSV file
    const ws = fs.createWriteStream(filename);
    csv.write(csvData, { headers: true })
      .pipe(ws)
      .on('finish', () => {
        res.download(filename, 'inventory.csv', (err) => {
          // Delete temp file after download
          fs.unlinkSync(filename);
          if (err) {
            console.error('Download error:', err);
            res.status(500).json({ message: 'Error downloading file' });
          }
        });
      });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Error exporting data' });
  }
}; 