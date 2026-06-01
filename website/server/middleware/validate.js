const { body, validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const loginValidation = [
  body('username').trim().escape().isLength({ min: 1, max: 50 }),
  body('password').isLength({ min: 1, max: 100 }),
  handleValidation,
];

const contactValidation = [
  body('name').trim().escape().isLength({ min: 1, max: 100 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 1, max: 5000 }),
  body('company').optional({ values: 'falsy' }).trim().escape(),
  handleValidation,
];

const sectionValidation = [
  body('content_zh').optional().isString(),
  body('content_en').optional().isString(),
  body('image_url').optional().trim().isString(),
  body('sort_order').optional().isInt(),
  handleValidation,
];

const linkValidation = [
  body('category_zh').trim().escape().isLength({ min: 1, max: 100 }),
  body('category_en').trim().escape().isLength({ min: 1, max: 100 }),
  body('title_zh').trim().escape().isLength({ min: 1, max: 200 }),
  body('title_en').trim().escape().isLength({ min: 1, max: 200 }),
  body('url').trim().isURL(),
  body('description_zh').optional().trim().escape(),
  body('description_en').optional().trim().escape(),
  body('sort_order').optional().isInt(),
  body('is_active').optional().isInt({ min: 0, max: 1 }),
  handleValidation,
];

const founderValidation = [
  body('name_zh').trim().escape().isLength({ min: 1, max: 100 }),
  body('name_en').trim().escape().isLength({ min: 1, max: 100 }),
  body('title_zh').trim().escape().isLength({ min: 1, max: 200 }),
  body('title_en').trim().escape().isLength({ min: 1, max: 200 }),
  body('bio_zh').optional().isString(),
  body('bio_en').optional().isString(),
  body('photo_url').optional().trim().isString(),
  body('email').optional({ values: 'falsy' }).trim().isEmail().normalizeEmail(),
  body('social_links').optional().isString(),
  body('is_active').optional().isInt({ min: 0, max: 1 }),
  handleValidation,
];

const partnerValidation = [
  body('name_zh').trim().escape().isLength({ min: 1, max: 200 }),
  body('name_en').trim().escape().isLength({ min: 1, max: 200 }),
  body('logo_url').optional().trim().isString(),
  body('url').optional({ values: 'falsy' }).trim().isURL(),
  body('description_zh').optional().trim().escape(),
  body('description_en').optional().trim().escape(),
  body('is_active').optional().isInt({ min: 0, max: 1 }),
  handleValidation,
];

const settingsValidation = [
  body().isObject(),
  handleValidation,
];

module.exports = {
  loginValidation,
  contactValidation,
  sectionValidation,
  linkValidation,
  founderValidation,
  partnerValidation,
  settingsValidation,
};
