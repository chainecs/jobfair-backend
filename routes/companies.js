/**
* @swagger
* components:
*   schemas:
*     Company:
*       type: object
*       required:
*         - name
*         - address
*         - business
*         - province
*         - postalcode
*         - picture
*       properties:
*         name:
*           type: string
*           description: Name of the company
*         address:
*           type: string
*           description: House No., Street, Road
*         business:
*           type: string
*           description: Business Description
*         province:
*           type: string
*           description: province
*         postalcode:
*           type: string
*           description: 5-digit postal code 
*         tel:
*           type: string
*           description: telephone number
*         picture:
*           type: string
*           description: picture
*/

const express = require("express");
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companies");

/**
* @swagger
* tags:
*   name: Companies
*   description: The companies managing API
*/

// Include other resource routers
const bookingRouter = require("./bookings");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers

/**
* @swagger
* /companies:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Create a new company
*     tags: [Companies]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Company'
*     responses:
*       201:
*         description: The company was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Company'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /companies:
*   get:
*     summary: Returns the list of all the companies
*     tags: [Companies]
*     responses:
*       200:
*         description: The list of the companies
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*               $ref: '#/components/schemas/Company'
*/
router.use("/:companyId/bookings", bookingRouter);
router
  .route("/")
  .get(getCompanies)
  .post(protect, authorize("admin"), createCompany);

/**
* @swagger
* /companies/{id}:
*   get:
*     summary: Get the company by id
*     tags: [Companies]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The company id
*     responses:
*       200:
*         description: The company description by id
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Company'
*       404:
*         description: The company was not found
*/

/**
* @swagger
* /companies/{id}:
*   put:
*     security:
*       - bearerAuth: []
*     summary: Update the company by id
*     tags: [Companies]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The company id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Company'
*     responses:
*       200:
*         description: The company was successfully updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Company'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /companies/{id}:
*   delete:
*     security:
*       - bearerAuth: []
*     summary: Delete the company by id
*     tags: [Companies]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The company id
*     responses:
*       200:
*         description: The company was successfully deleted
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Company'
*       404:
*         description: The company was not found
*/
router
  .route("/:id")
  .get(getCompany)
  .put(protect, authorize("admin"), updateCompany)
  .delete(protect, authorize("admin"), deleteCompany);

module.exports = router;
