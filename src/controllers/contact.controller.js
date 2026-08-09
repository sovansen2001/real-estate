import ContactService from "../services/contact.service.js";
import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

class ContactController {

    /*
    |--------------------------------------------------------------------------
    | CREATE CONTACT MESSAGE
    |--------------------------------------------------------------------------
    */

    createContact = asyncHandler(
        async (req, res) => {

            const contact =
                await ContactService.createContact(
                    req.body
                );

            return res.status(201).json(
                new ApiResponse(
                    201,
                    {
                        id: contact._id
                    },
                    "Message sent successfully."
                )
            );
        }
    );
}

export default new ContactController();