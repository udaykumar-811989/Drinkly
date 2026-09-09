import { z } from 'zod'
import { calculateAge } from './utils'

const uuidSchema = z.string().uuid()

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(255),
  dateOfBirth: z
    .string()
    .transform((val) => new Date(val))
    .refine(
      (date) => !isNaN(date.getTime()),
      'Invalid date of birth'
    )
    .refine(
      (date) => calculateAge(date) >= 13,
      'You must be at least 13 years old to register'
    ),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const verifyPhoneSchema = z.object({
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20),
  code: z.string().length(6, 'OTP must be 6 digits'),
})

export const ageVerificationSchema = z.object({
  idDocumentUrl: z.string().url('Invalid document URL'),
  idDocumentType: z.enum(['PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID', 'OTHER']),
})

export const addressSchema = z.object({
  label: z.string().max(50).optional(),
  line1: z.string().min(1, 'Address line 1 is required').max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  zipCode: z.string().min(1, 'ZIP code is required').max(20),
  country: z.string().length(2, 'Country must be 2 characters').default('IN'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  isDefault: z.boolean().default(false),
})

export const retailerApplySchema = z.object({
  legalBusinessName: z.string().min(1, 'Legal business name is required').max(255),
  displayName: z.string().min(1, 'Display name is required').max(255),
  description: z.string().max(2000).optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20),
  email: z.string().email('Invalid email address').max(255),
  addressLine1: z.string().min(1, 'Address is required').max(255),
  addressLine2: z.string().max(255).optional(),
  addressCity: z.string().min(1, 'City is required').max(100),
  addressState: z.string().min(1, 'State is required').max(100),
  addressZipCode: z.string().min(1, 'ZIP code is required').max(20),
  addressCountry: z.string().length(2).default('IN'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  minimumOrderAmount: z.number().min(0).default(0),
  estimatedDeliveryTimeMinutes: z.number().int().min(15).max(480).default(60),
  operatingRadiusKm: z.number().min(1).max(100).default(10),
  licenceNumber: z.string().min(1, 'Licence number is required').max(100),
  licenceType: z.string().min(1, 'Licence type is required').max(50),
  issuingAuthority: z.string().min(1, 'Issuing authority is required').max(255),
  licenceIssueDate: z.string().transform((val) => new Date(val)),
  licenceExpiryDate: z.string().transform((val) => new Date(val)),
  licenceDocumentUrl: z.string().url('Invalid document URL'),
})

export const productCreateSchema = z.object({
  retailerId: uuidSchema,
  categoryId: uuidSchema,
  name: z.string().min(1, 'Product name is required').max(255),
  brand: z.string().min(1, 'Brand is required').max(255),
  description: z.string().max(2000).optional(),
  bottleSizeMl: z.number().int().min(1, 'Bottle size is required'),
  alcoholPercentage: z.number().min(0).max(100),
  mrp: z.number().positive('MRP must be positive'),
  sellingPrice: z.number().positive('Selling price must be positive'),
  sku: z.string().min(1, 'SKU is required').max(100),
  barcode: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
  isAgeRestricted: z.boolean().default(true),
})

export const productUpdateSchema = z.object({
  categoryId: uuidSchema.optional(),
  name: z.string().min(1).max(255).optional(),
  brand: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  bottleSizeMl: z.number().int().min(1).optional(),
  alcoholPercentage: z.number().min(0).max(100).optional(),
  mrp: z.number().positive().optional(),
  sellingPrice: z.number().positive().optional(),
  barcode: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
  status: z.enum(['ACTIVE', 'OUT_OF_STOCK', 'HIDDEN', 'SUSPENDED']).optional(),
  isAgeRestricted: z.boolean().optional(),
})

export const cartItemSchema = z.object({
  productId: uuidSchema,
  retailerId: uuidSchema,
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99),
})

export const checkoutSchema = z.object({
  deliveryAddressId: uuidSchema,
  notes: z.string().max(500).optional(),
  specialInstructions: z.string().max(500).optional(),
  paymentMethod: z.enum(['CARD', 'WALLET', 'COD', 'UPI']),
})

export const orderCreateSchema = z.object({
  customerId: uuidSchema,
  retailerId: uuidSchema,
  deliveryAddressId: uuidSchema,
  items: z
    .array(
      z.object({
        productId: uuidSchema,
        quantity: z.number().int().min(1),
        unitPrice: z.number().positive(),
      })
    )
    .min(1, 'At least one item is required'),
  notes: z.string().max(500).optional(),
  specialInstructions: z.string().max(500).optional(),
})

export const complianceRuleSchema = z.object({
  jurisdiction: z.string().min(1, 'Jurisdiction is required').max(100),
  ruleType: z.enum([
    'MINIMUM_AGE',
    'DELIVERY_ENABLED',
    'DELIVERY_HOURS',
    'DRY_DAY',
    'RESTRICTED_LOCATION',
    'ALLOWED_LICENCE_TYPE',
    'ALLOWED_PRODUCT_CATEGORY',
    'MAX_ORDER_LIMIT',
    'DELIVERY_REQUIREMENT',
    'REQUIRED_VERIFICATION',
  ]),
  ruleValue: z.record(z.unknown()),
  effectiveFrom: z.string().transform((val) => new Date(val)),
  effectiveUntil: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
})

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200),
  category: uuidSchema.optional(),
  brand: z.string().max(255).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export const storeFilterSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusKm: z.number().min(0.5).max(100).default(10),
  minRating: z.number().min(0).max(5).optional(),
  isOpen: z.boolean().optional(),
  sortBy: z.enum(['distance', 'rating', 'deliveryTime']).default('distance'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export const supportTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  category: z.enum([
    'ORDER_ISSUE',
    'DELIVERY_ISSUE',
    'PAYMENT_ISSUE',
    'ACCOUNT_ISSUE',
    'AGE_VERIFICATION',
    'PRODUCT_INQUIRY',
    'RETAILER_INQUIRY',
    'COMPLIANCE',
    'FEEDBACK',
    'OTHER',
  ]),
})

export const reviewSchema = z.object({
  retailerId: uuidSchema.optional(),
  productId: uuidSchema.optional(),
  deliveryId: uuidSchema.optional(),
  orderId: uuidSchema.optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5),
  comment: z.string().max(2000).optional(),
})

export const deliveryAgentApplySchema = z.object({
  dateOfBirth: z
    .string()
    .transform((val) => new Date(val))
    .refine(
      (date) => !isNaN(date.getTime()),
      'Invalid date of birth'
    )
    .refine(
      (date) => calculateAge(date) >= 18,
      'You must be at least 18 years old'
    ),
  vehicleType: z.string().min(1, 'Vehicle type is required').max(50),
  vehicleNumber: z.string().min(1, 'Vehicle number is required').max(20),
  licenseNumber: z.string().min(1, 'License number is required').max(50),
  addressLine1: z.string().min(1, 'Address is required').max(255),
  addressLine2: z.string().max(255).optional(),
  addressCity: z.string().min(1, 'City is required').max(100),
  addressState: z.string().min(1, 'State is required').max(100),
  addressZipCode: z.string().min(1, 'ZIP code is required').max(20),
  addressCountry: z.string().length(2).default('IN'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>
export type AgeVerificationInput = z.infer<typeof ageVerificationSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type RetailerApplyInput = z.infer<typeof retailerApplySchema>
export type ProductCreateInput = z.infer<typeof productCreateSchema>
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type OrderCreateInput = z.infer<typeof orderCreateSchema>
export type ComplianceRuleInput = z.infer<typeof complianceRuleSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type StoreFilterInput = z.infer<typeof storeFilterSchema>
export type SupportTicketInput = z.infer<typeof supportTicketSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type DeliveryAgentApplyInput = z.infer<typeof deliveryAgentApplySchema>
