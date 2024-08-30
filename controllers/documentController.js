const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('../config/database');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

exports.uploadDocument = [
    upload.single('file'),
    async (req, res) => {
        const { reqData } = req.body;       
        if (!req.file) {
            return res.status(400).json({ error: 'File and description are required' });
        }

        try {
            const result = await pool.query(
                'INSERT INTO documents (filename, filepath, label) VALUES ($1, $2, $3) RETURNING *',
                [req.file.filename, req.file.path, req.body.label]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

exports.listDocuments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM documents');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editDocument = async (req, res) => {
    const { id } = req.params;
    const { label } = req.body;

    if (!label) {
        return res.status(400).json({ error: 'File description is required' });
    }

    try {
        const result = await pool.query(
            'UPDATE documents SET label = $1 WHERE id = $2 RETURNING *',
            [label, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT filepath FROM documents WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            fs.unlinkSync(result.rows[0].filepath); 
            await pool.query('DELETE FROM documents WHERE id = $1', [id]);
            res.status(200).json({ message: 'Document deleted successfully' });
        } else {
            res.status(404).json({ error: 'Document not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
