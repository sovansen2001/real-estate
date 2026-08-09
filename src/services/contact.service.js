import Contact from "../models/contact.model.js";

class ContactService {

    /*
    |--------------------------------------------------------------------------
    | CREATE CONTACT MESSAGE
    |--------------------------------------------------------------------------
    |
    | Public endpoint.
    |
    | The frontend contact page can submit without authentication.
    |--------------------------------------------------------------------------
    */

    async createContact(contactData) {

        const contact = await Contact.create(
            contactData
        );

        return contact;
    }
}

export default new ContactService();