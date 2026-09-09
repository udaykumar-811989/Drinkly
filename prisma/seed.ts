import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  console.log('⚠️  DEVELOPMENT/TEST DATA ONLY')

  // Create Jurisdiction
  const jurisdiction = await prisma.jurisdiction.create({
    data: {
      name: 'California',
      code: 'CA',
      country: 'US',
      state: 'California',
      isAlcoholDeliveryEnabled: true,
      minimumAge: 21,
      timezone: 'America/Los_Angeles'
    }
  })

  // Create Compliance Rules for California
  await prisma.complianceRule.createMany({
    data: [
      { jurisdiction: 'CA', ruleType: 'MINIMUM_AGE', ruleValue: { age: 21 }, effectiveFrom: new Date(), status: 'ACTIVE', createdById: 'system' },
      { jurisdiction: 'CA', ruleType: 'DELIVERY_ENABLED', ruleValue: { enabled: true }, effectiveFrom: new Date(), status: 'ACTIVE', createdById: 'system' },
      { jurisdiction: 'CA', ruleType: 'DELIVERY_HOURS', ruleValue: { monday: { open: '08:00', close: '22:00' }, tuesday: { open: '08:00', close: '22:00' }, wednesday: { open: '08:00', close: '22:00' }, thursday: { open: '08:00', close: '22:00' }, friday: { open: '08:00', close: '23:00' }, saturday: { open: '08:00', close: '23:00' }, sunday: { open: '10:00', close: '22:00' } }, effectiveFrom: new Date(), status: 'ACTIVE', createdById: 'system' },
    ]
  })

  // Create System Settings
  await prisma.systemSetting.createMany({
    data: [
      { key: 'platform_name', value: 'Drinkly', description: 'Platform name' },
      { key: 'platform_fee_percentage', value: 5, description: 'Platform fee percentage' },
      { key: 'free_delivery_threshold', value: 50, description: 'Free delivery threshold in USD' },
      { key: 'default_delivery_fee', value: 4.99, description: 'Default delivery fee' },
      { key: 'maintenance_mode', value: false, description: 'System maintenance mode' },
    ]
  })

  // Create Demo Admin
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@drinkly.com',
      phone: '+1234567890',
      passwordHash: adminPassword,
      name: 'Drinkly Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    }
  })

  // Create Demo Customer
  const customerPassword = await bcrypt.hash('Customer@123', 12)
  const customer = await prisma.user.create({
    data: {
      email: 'customer@drinkly.com',
      phone: '+1234567891',
      passwordHash: customerPassword,
      name: 'John Customer',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
      customerProfile: {
        create: {
          dateOfBirth: new Date('1990-05-15'),
          ageVerified: 'VERIFIED',
        }
      }
    }
  })

  // Create Demo Retailer Owner
  const retailerOwnerPassword = await bcrypt.hash('Retailer@123', 12)
  const retailerOwner = await prisma.user.create({
    data: {
      email: 'retailer@drinkly.com',
      phone: '+1234567892',
      passwordHash: retailerOwnerPassword,
      name: 'Retail Store Owner',
      role: 'RETAILER_OWNER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    }
  })

  // Create Demo Retailer
  const retailer = await prisma.retailer.create({
    data: {
      ownerId: retailerOwner.id,
      legalBusinessName: 'Premium Spirits LLC',
      displayName: 'Premium Spirits',
      description: 'Your trusted local liquor store with a wide selection of spirits, wine, and beer.',
      phone: '+1234567893',
      email: 'store@premiumspirits.com',
      line1: '123 Main Street',
      city: 'Los Angeles',
      state: 'California',
      zipCode: '90001',
      country: 'US',
      latitude: 34.0522,
      longitude: -118.2437,
      status: 'ACTIVE',
      minimumOrderAmount: 25,
      estimatedDeliveryTimeMinutes: 45,
      operatingRadiusKm: 15,
      rating: 4.5,
    }
  })

  // Create Demo Retailer Licence
  await prisma.retailerLicence.create({
    data: {
      retailerId: retailer.id,
      licenceNumber: 'DEMO-LIC-001',
      licenceType: 'Off-Sale General',
      issuingAuthority: 'California ABC',
      issueDate: new Date('2024-01-01'),
      expiryDate: new Date('2026-12-31'),
      verificationStatus: 'VERIFIED',
      verifiedById: admin.id,
      verifiedAt: new Date(),
      verificationNotes: 'DEMO DATA - Not a real licence',
    }
  })

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Whiskey', slug: 'whiskey', description: 'Bourbon, Scotch, Rye, and more', isActive: true } }),
    prisma.category.create({ data: { name: 'Vodka', slug: 'vodka', description: 'Premium and classic vodkas', isActive: true } }),
    prisma.category.create({ data: { name: 'Gin', slug: 'gin', description: 'London Dry, Old Tom, and craft gins', isActive: true } }),
    prisma.category.create({ data: { name: 'Rum', slug: 'rum', description: 'White, dark, and spiced rums', isActive: true } }),
    prisma.category.create({ data: { name: 'Tequila', slug: 'tequila', description: 'Blanco, Reposado, Añejo', isActive: true } }),
    prisma.category.create({ data: { name: 'Wine', slug: 'wine', description: 'Red, White, Rosé, and Sparkling', isActive: true } }),
    prisma.category.create({ data: { name: 'Beer', slug: 'beer', description: 'Craft, Lager, IPA, and more', isActive: true } }),
    prisma.category.create({ data: { name: 'Spirits', slug: 'spirits', description: 'Other spirits and liqueurs', isActive: true } }),
  ])

  // Create Demo Products
  const products = [
    { name: 'Jack Daniel\'s Old No. 7', brand: 'Jack Daniel\'s', categoryId: categories[0].id, bottleSizeMl: 750, alcoholPercentage: 40, mrp: 34.99, sellingPrice: 29.99, sku: 'JD-ON7-750', description: 'Tennessee Whiskey with notes of caramel, vanilla, and oak.' },
    { name: 'Grey Goose Vodka', brand: 'Grey Goose', categoryId: categories[1].id, bottleSizeMl: 750, alcoholPercentage: 40, mrp: 49.99, sellingPrice: 44.99, sku: 'GG-VOD-750', description: 'Premium French vodka crafted from wheat.' },
    { name: 'Hendrick\'s Gin', brand: 'Hendrick\'s', categoryId: categories[2].id, bottleSizeMl: 750, alcoholPercentage: 41.4, mrp: 44.99, sellingPrice: 39.99, sku: 'HEN-GIN-750', description: 'Scottish gin with rose and cucumber notes.' },
    { name: 'Bacardi Superior', brand: 'Bacardi', categoryId: categories[3].id, bottleSizeMl: 750, alcoholPercentage: 40, mrp: 24.99, sellingPrice: 21.99, sku: 'BAC-SUP-750', description: 'Light and smooth Caribbean rum.' },
    { name: 'Patrón Silver', brand: 'Patrón', categoryId: categories[4].id, bottleSizeMl: 750, alcoholPercentage: 40, mrp: 54.99, sellingPrice: 49.99, sku: 'PAT-SLV-750', description: 'Ultra-premium silver tequila.' },
    { name: 'Caymus Cabernet Sauvignon', brand: 'Caymus', categoryId: categories[5].id, bottleSizeMl: 750, alcoholPercentage: 14.5, mrp: 89.99, sellingPrice: 84.99, sku: 'CAY-CAB-750', description: 'Napa Valley Cabernet Sauvignon.' },
    { name: 'Sierra Nevada Pale Ale', brand: 'Sierra Nevada', categoryId: categories[6].id, bottleSizeMl: 355, alcoholPercentage: 5.6, mrp: 2.99, sellingPrice: 2.49, sku: 'SN-PA-355', description: 'Classic American pale ale.' },
    { name: 'Jameson Irish Whiskey', brand: 'Jameson', categoryId: categories[0].id, bottleSizeMl: 750, alcoholPercentage: 40, mrp: 39.99, sellingPrice: 34.99, sku: 'JAM-IRW-750', description: 'Triple-distilled smooth Irish whiskey.' },
    { name: 'Tito\'s Handmade Vodka', brand: 'Tito\'s', categoryId: categories[1].id, bottleSizeMl: 750, alcoholPercentage: 40, mrp: 29.99, sellingPrice: 25.99, sku: 'TIT-VOD-750', description: 'Handmade vodka from Texas.' },
    { name: 'Corona Extra', brand: 'Corona', categoryId: categories[6].id, bottleSizeMl: 355, alcoholPercentage: 4.5, mrp: 1.99, sellingPrice: 1.79, sku: 'COR-EXT-355', description: 'Mexican lager beer.' },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        retailerId: retailer.id,
        status: 'ACTIVE',
        isAgeRestricted: true,
      }
    })
  }

  // Create Demo Delivery Agent
  const deliveryPassword = await bcrypt.hash('Delivery@123', 12)
  const deliveryUser = await prisma.user.create({
    data: {
      email: 'driver@drinkly.com',
      phone: '+1234567893',
      passwordHash: deliveryPassword,
      name: 'Mike Driver',
      role: 'DELIVERY_AGENT',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    }
  })

  await prisma.deliveryAgent.create({
    data: {
      userId: deliveryUser.id,
      dateOfBirth: new Date('1988-03-20'),
      vehicleType: 'Car',
      vehicleNumber: 'ABC-1234',
      licenseNumber: 'DL-12345678',
      line1: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'California',
      zipCode: '90002',
      country: 'US',
      latitude: 34.0500,
      longitude: -118.2500,
      status: 'ACTIVE',
      isAvailable: true,
      rating: 4.8,
      totalDeliveries: 150,
    }
  })

  // Create Demo Compliance Officer
  const compliancePassword = await bcrypt.hash('Compliance@123', 12)
  await prisma.user.create({
    data: {
      email: 'compliance@drinkly.com',
      phone: '+1234567894',
      passwordHash: compliancePassword,
      name: 'Sarah Compliance',
      role: 'COMPLIANCE_OFFICER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    }
  })

  // Create Demo Support Tickets
  await prisma.supportTicket.create({
    data: {
      userId: customer.id,
      subject: 'Delivery was late',
      description: 'My order was delivered 30 minutes late.',
      category: 'DELIVERY',
      status: 'OPEN',
      priority: 'MEDIUM',
    }
  })

  console.log('✅ Seed data created successfully!')
  console.log('')
  console.log('📧 Demo Accounts:')
  console.log('  Admin:        admin@drinkly.com / Admin@123')
  console.log('  Customer:     customer@drinkly.com / Customer@123')
  console.log('  Retailer:     retailer@drinkly.com / Retailer@123')
  console.log('  Delivery:     driver@drinkly.com / Delivery@123')
  console.log('  Compliance:   compliance@drinkly.com / Compliance@123')
  console.log('')
  console.log('⚠️  ALL DATA IS FOR DEVELOPMENT/TESTING ONLY')
  console.log('⚠️  DO NOT use demo licence numbers as proof of real licences')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
