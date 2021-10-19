const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const vendorValidation = require('../validations/vendor.validation');
const vendorController = require('../controllers/vendor.controller');

const router = express.Router();

router.post('/create', validate(vendorValidation.createVendor), vendorController.create);

router.route('/').get(auth('getVendors'), validate(vendorValidation.getVendors), vendorController.getVendors);

router
  .route('/:vendorId')
  .get(auth('getVendors'), validate(vendorValidation.getVendor), vendorController.getVendor)
  .patch(auth('manageVendor'), validate(vendorValidation.updateVendor), vendorController.updateVendor)
  .delete(auth('manageVendor'), validate(vendorValidation.deleteVendor), vendorController.deleteVendor);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Vendors management
 */

/**
 * @swagger
 * /vendors/create:
 *   post:
 *     summary: Create a Vendor
 *     description: Only vendors, admins or masters can create vendors.
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *               - type
 *               - address
 *               - open_time
 *               - close_time
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               mobile:
 *                 type: string
 *                 description: mobile number with country code
 *               type:
 *                  type: string
 *                  enum: [restaurant,fastFood,homemade,grocery]
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               commission:
 *                 type: decimal
 *               open_time:
 *                 type: string
 *                 description: time in 24 hours format
 *               close_time:
 *                 type: string
 *                 description: time in 24 hours format
 *               is_active:
 *                 type: boolean
 *               is_online:
 *                 type: boolean
 *             example:
 *               name: ABC Plaza
 *               email: abc@example.com
 *               mobile: "+918494747884"
 *               type: restaurant
 *               city: Bengaluru
 *               state: Karnataka
 *               address: Sector IV, HSR Layout
 *               open_time: 09:00
 *               close_time: 18:00
 *               is_active: false
 *               is_online: false
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vendor:
 *                   $ref: '#/components/schemas/Vendor'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: Get all Vendors
 *     description: Only admins or master users can retrieve all vendors.
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Vendor type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of vendors
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vendors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VendorList'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 count:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /vendors/{id}:
 *   get:
 *     summary: Get a vendor
 *     description: Only admins or master users can retrieve a vendor.
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Vendor id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Vendor'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a vendor
 *     description: Logged in vendor can update only themselves. Only admins or master users can update any vendor.
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Vendor id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               mobile:
 *                 type: string
 *                 description: mobile number with country code
 *               type:
 *                  type: string
 *                  enum: [restaurant,fastFood,homemade,grocery]
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               commission:
 *                 type: decimal
 *               open_time:
 *                 type: string
 *                 description: time in 24 hours format
 *               close_time:
 *                 type: string
 *                 description: time in 24 hours format
 *               is_active:
 *                 type: boolean
 *               is_online:
 *                 type: boolean
 *             example:
 *               name: ABC Plaza
 *               email: abc@example.com
 *               mobile: "+918494747884"
 *               type: restaurant
 *               city: Bengaluru
 *               state: Karnataka
 *               address: Sector IV, HSR Layout
 *               open_time: 09:00
 *               close_time: 18:00
 *               is_active: false
 *               is_online: false
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: string
 *                    example: Vendor details updated
 *                 result:
 *                  $ref: '#/components/schemas/Vendor'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a vendor
 *     description: Logged in users can delete only themselves. Only admins or master users can delete any vendor.
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Vendor id
 *     responses:
 *       "200":
 *          description: OK
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: string
 *                    example: Vendor deleted
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
