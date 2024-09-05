const axios = require('axios');
const db = require('../config/db');

const FRESHSALES_API_KEY = process.env.FRESHSALES_API_KEY;
const FRESHSALES_DOMAIN = process.env.FRESHSALES_DOMAIN;

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token token=${FRESHSALES_API_KEY}`
};

async function performCRMRequest(method, url, data) {
    try {
        const response = await axios({
            method,
            url: `https://${FRESHSALES_DOMAIN}.freshsales.io${url}`,
            data,
            headers
        });
        return response.data;
    } catch (error) {
        throw new Error(`CRM request failed: ${error.message}`);
    }
}

async function performDBRequest(query, params) {
    try {
        const [result] = await db.execute(query, params);
        return result;
    } catch (error) {
        throw new Error(`Database request failed: ${error.message}`);
    }
}

async function createContact({ first_name, last_name, email, mobile_number, data_store }) {
    if (data_store === 'CRM') {
        return performCRMRequest('post', '/api/contacts', {
            contact: { first_name, last_name, email, mobile_number }
        });
    } else if (data_store === 'DATABASE') {
        const result = await performDBRequest(
            'INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)',
            [first_name, last_name, email, mobile_number]
        );
        return { id: result.insertId, first_name, last_name, email, mobile_number };
    } else {
        throw new Error('Invalid DATA_STORE configuration');
    }
}

async function getContact({ contact_id, data_store }) {
    if (data_store === 'CRM') {
        return performCRMRequest('get', `/api/contacts/${contact_id}`);
    } else if (data_store === 'DATABASE') {
        const rows = await performDBRequest('SELECT * FROM contacts WHERE id = ?', [contact_id]);
        if (rows.length === 0) {
            throw new Error('Contact not found');
        }
        return rows[0];
    } else {
        throw new Error('Invalid DATA_STORE configuration');
    }
}

async function updateContact({ contact_id, new_email, new_mobile_number, data_store }) {
    if (data_store === 'CRM') {
        return performCRMRequest('put', `/api/contacts/${contact_id}`, {
            contact: { email: new_email, mobile_number: new_mobile_number }
        });
    } else if (data_store === 'DATABASE') {
        const result = await performDBRequest(
            'UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?',
            [new_email, new_mobile_number, contact_id]
        );
        if (result.affectedRows === 0) {
            throw new Error('Contact not found');
        }
        const rows = await performDBRequest('SELECT * FROM contacts WHERE id = ?', [contact_id]);
        return rows[0];
    } else {
        throw new Error('Invalid DATA_STORE configuration');
    }
}

async function deleteContact({ contact_id, data_store }) {
    if (data_store === 'CRM') {
        return performCRMRequest('delete', `/api/contacts/${contact_id}`);
    } else if (data_store === 'DATABASE') {
        const result = await performDBRequest('DELETE FROM contacts WHERE id = ?', [contact_id]);
        if (result.affectedRows === 0) {
            throw new Error('Contact not found');
        }
        return { "message": `Contact with id ${contact_id} deleted successfully` };
    } else {
        throw new Error('Invalid DATA_STORE configuration');
    }
}

module.exports = {
    createContact,
    getContact,
    updateContact,
    deleteContact
};