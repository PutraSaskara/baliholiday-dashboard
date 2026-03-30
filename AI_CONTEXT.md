# AI Context & Implementation Details

This file is intended to serve as a quick-start guide and context reference for AI assistants (like Claude, ChatGPT, Gemini, etc.) working on this project.

## 🏗️ Architecture & Conventions

* **Model-View-Controller (MVC) Pattern**: The backend strictly separates concerns.
  * `routes/` define the endpoints and attach middleware.
  * `controllers/` handle the request/response cycle, business logic, and database orchestration.
  * `models/` define the Sequelize structures and relationships.
* **Sequelize Relationships**: Be aware of deep associations, especially on the `Tour` model, which relates to `Detail`, `Plan`, `Description`, `Include`, `NotInclude`, `Cancellation`, and `Image`. Many endpoints use `include: [...]` to fetch related data concurrently.
* **Error Handling**: Controllers follow a pattern of try/catch blocks. Sequelize validation errors (`SequelizeValidationError` or `SequelizeUniqueConstraintError`) are often mapped to `400 Bad Request` with structured error messages.

## 🖼️ Image Upload Ecosystem (Recent Refactor)

**IMPORTANT CONTEXT:** The project recently underwent a major refactor (March 2026) to migrate from local `multer` disk storage to Cloudinary.

1. **Middleware (`middleware/uploadCloudinary.js`)**:
   * Uses `multer` with `memoryStorage`. **No images are saved to the local disk anymore.**
   * Exports helper functions:
     * `uploadToCloudinary(buffer, folder)`: Direct buffer upload.
     * `deleteFromCloudinary(publicId)`: Used to clean up old images.
     * `extractPublicId(url)`: Helper to parse Cloudinary URLs so they can be passed to the delete function.
2. **Controllers**:
   * When handling files (`req.file` or `req.files`), controllers upload the buffers directly to Cloudinary.
   * On `UPDATE` or `DELETE` actions, the controllers **must** proactively extract the `public_id` of the old images from the database and call `deleteFromCloudinary` to prevent orphaned files in the Cloudinary bucket. Look at `ImageController.js` or `BlogImageController.js` for the standard pattern.
   * `fs.unlinkSync` and local file references (`public/uploads`, `public/areas`) have been completely removed and should **not** be reintroduced.
3. **Database Schema changes**:
   * For multiple images (e.g., `ImageModel`, `BlogImageModel`), the database stores both the `public_id` (in columns like `image1`, `image2`) and the `secure_url` (in columns like `imageUrl1`, `imageUrl2`).

## 🔐 Authentication

* The system uses JWT.
* The main authentication middleware is located in `middleware/auth.js`.
* When writing or updating endpoints that modify data (POST, PUT, DELETE), ensure `authMiddleware` is applied in the route definition unless it is explicitly a public endpoint.

## 🚀 Known "Gotchas"

* **Pagination**: Several controllers (`getTours`, `getBlogs`) implement pagination manually by reading `page` and `limit` from `req.query`, using Sequelize's `limit` and `offset`. Maintain this pattern if adding new list endpoints.
* **Slugification**: Slugs are generated dynamically during resource creation and updates using the `utils/slugify.js` helper. When a title changes on update, the controller must re-generate and save the new slug.
* **Associations on Delete**: When deleting a primary resource (e.g., a `Tour` in `TourController.js`), all associated child records (Plans, Images, Details) must be explicitly deleted or configured for `CASCADE` delete to avoid orphaned records. Currently, `TourController.deleteTour` manually drops child records using `Promise.all`.

---

**When asked to modify the codebase:**
1. Align with the Cloudinary upload architecture.
2. Respect existing query structures (Search, Pagination, Categories).
3. Ensure Sequelize queries are properly catching validation errors. 
