const express = require('express');
const router = express.Router();
const contactService = require('../services/contact.service');

router.post('/createContact', async (req, res) => {
    try {
        const result = await contactService.createContact(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/getContact', async (req, res) => {
    try {
        const result = await contactService.getContact(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/updateContact', async (req, res) => {
    try {
        const result = await contactService.updateContact(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/deleteContact', async (req, res) => {
    try {
        const result = await contactService.deleteContact(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;