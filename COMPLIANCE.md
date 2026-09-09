# Compliance Documentation

> **DISCLAIMER**: This documentation describes the technical compliance features of the Drinkly platform. It does not constitute legal advice. Compliance requirements vary by jurisdiction and change over time. Consult qualified legal counsel for authoritative guidance on alcohol delivery regulations in your area.

---

## Legal Framework Overview

Alcohol delivery is regulated at multiple levels:

- **Federal**: TTB (Alcohol and Tobacco Tax and Trade Bureau) in the US
- **State**: State alcohol control boards (ABC)
- **County/Municipal**: Local ordinances and licensing

Each jurisdiction may have different rules for:
- Age requirements (21+ in all US states)
- Licensing requirements for retailers and delivery services
- Operating hours for alcohol sales
- Dry days and holidays
- Delivery restrictions
- Product type restrictions
- Container size limits

Drinkly's compliance engine is designed to enforce these rules programmatically.

---

## Age Verification System

### Registration

- Date of birth required at account creation
- Age calculated and must be 21+ (configurable per jurisdiction)
- Age verification status stored on user profile

### Verification Tiers

| Tier | Method | Description |
|------|--------|-------------|
| Basic | DOB check | Minimum age verified at registration |
| Standard | ID upload | Government ID uploaded and reviewed |
| Enhanced | Third-party | Integration with age verification services |

### Enforcement Points

- Account registration
- Checkout (age re-confirmation)
- Delivery (ID check at door)

### Proof of Age

Delivery drivers must verify recipient age:
- Valid government-issued photo ID
- Minimum age 21 (or jurisdiction requirement)
- Failed verification → order refused, refund initiated

---

## Retailer License Verification

### Required Information

- License number
- License type (on-premises, off-premises, etc.)
- Issuing authority
- Issue date
- Expiry date
- Document upload (PDF/image)

### Verification Process

1. Retailer submits license during onboarding
2. System stores license details
3. Admin reviews and verifies against issuing authority
4. License status: PENDING → VERIFIED or REJECTED
5. Expiry dates tracked with automated renewal reminders
6. Expired licenses trigger automatic store deactivation

### Enforcement

- Stores cannot list products without verified license
- Expired licenses disable store operations
- Audit log records all license verification actions

---

## Jurisdiction-Based Rules

### Rule Configuration

Compliance rules are stored in the `ComplianceRule` model with jurisdiction scoping:

```json
{
  "name": "Sunday Sales Restriction",
  "jurisdiction": "IL",
  "type": "OPERATING_HOURS",
  "config": {
    "dayOfWeek": 0,
    "allowedHours": null,
    "message": "Alcohol delivery not available on Sundays in Illinois"
  },
  "active": true
}
```

### Rule Types

| Type | Description |
|------|-------------|
| `DRY_DAY` | Days when alcohol sales/delivery prohibited |
| `OPERATING_HOURS` | Allowed hours for alcohol sales |
| `DELIVERY_RESTRICTION` | Delivery zone or distance limits |
| `AGE_REQUIREMENT` | Minimum age (may vary by product type) |
| `PRODUCT_RESTRICTION` | Product type or category restrictions |
| `CONTAINER_RESTRICTION` | Size or container type limits |

### Jurisdiction Examples

```
IL        → Illinois state-wide rules
IL/Chicago → Chicago city-specific rules (override state)
NY        → New York state-wide rules
NY/NYC    → New York City rules
```

More specific jurisdictions override broader ones.

---

## Dry Day Compliance

### Configuration

```json
{
  "jurisdiction": "IL",
  "type": "DRY_DAY",
  "config": {
    "dates": ["2024-01-01", "2024-07-04", "2024-12-25"],
    "dayOfWeek": [0],
    "exceptions": []
  }
}
```

### Enforcement

- Checkout validates delivery date against dry day rules
- If delivery date falls on a dry day, order blocked
- Customer notified with explanation
- Dry day calendar maintained per jurisdiction

### Common Dry Days (US Examples)

- New Year's Day
- Independence Day
- Labor Day
- Thanksgiving
- Christmas Day
- State-specific holidays

---

## Operating Hours Compliance

### Configuration

```json
{
  "jurisdiction": "IL",
  "type": "OPERATING_HOURS",
  "config": {
    "allowedHours": {
      "monday": { "start": "08:00", "end": "23:00" },
      "tuesday": { "start": "08:00", "end": "23:00" },
      "wednesday": { "start": "08:00", "end": "23:00" },
      "thursday": { "start": "08:00", "end": "23:00" },
      "friday": { "start": "08:00", "end": "00:00" },
      "saturday": { "start": "08:00", "end": "00:00" },
      "sunday": { "start": "10:00", "end": "22:00" }
    }
  }
}
```

### Enforcement

- Delivery slot availability respects jurisdiction hours
- Store operating hours cannot exceed jurisdiction limits
- Late-night orders blocked automatically

---

## Delivery Restrictions

### Distance Limits

```json
{
  "jurisdiction": "IL",
  "type": "DELIVERY_RESTRICTION",
  "config": {
    "maxDistanceKm": 15,
    "maxDeliveryTimeMinutes": 60,
    "restrictedAreas": []
  }
}
```

### Zone-Based Restrictions

- Delivery address validated against allowed zones
- Restricted areas (schools, churches) configurable
- Distance calculated from store to delivery address

### Proof of Delivery

- Photo required at delivery
- Signature capture (optional)
- Delivery GPS coordinates logged
- Delivery timestamp recorded

---

## Product Restrictions

### Configurable Restrictions

```json
{
  "jurisdiction": "IL",
  "type": "PRODUCT_RESTRICTION",
  "config": {
    "restrictedCategories": [],
    "maxAlcoholContent": null,
    "maxContainerSizeMl": null,
    "allowedProductTypes": ["beer", "wine", "spirits"]
  }
}
```

### Common Restrictions

- Some jurisdictions limit ABV (alcohol by volume)
- Container size limits (e.g., no handles over 1L)
- Product type restrictions (some states limit spirits delivery)
- Brand-specific regulations

---

## Audit Trail Requirements

### What Must Be Logged

Every compliance-relevant action must be logged:

| Event | Required Data |
|-------|---------------|
| Age verification | User ID, method, result, timestamp |
| License verification | Retailer ID, license #, result, admin ID |
| Order compliance check | Order ID, rules checked, result |
| Delivery attempt | Order ID, driver ID, ID check result |
| Compliance override | Admin ID, order ID, reason, timestamp |
| Rule changes | Rule ID, old config, new config, admin ID |

### Retention

- Audit logs retained for minimum 7 years (configurable)
- Logs are append-only (no modification or deletion)
- Stored in both database and external log service
- Regular export to cold storage for long-term retention

### Access

- Admin panel for real-time viewing
- API for automated compliance reporting
- Export to CSV/PDF for regulatory submissions

---

## Data Privacy

### GDPR Considerations (EU/UK)

- Data processing consent required
- Right to access (data export)
- Right to erasure (account deletion)
- Data portability
- Privacy policy required
- Data Protection Officer (DPO) appointment (if required)

### CCPA Considerations (California)

- "Do Not Sell My Personal Information" option
- Data disclosure requirements
- Consumer right to deletion
- Opt-out mechanisms

### Privacy by Design

- Data minimization (collect only what's needed)
- Purpose limitation (use data only for stated purposes)
- Storage limitation (delete data when no longer needed)
- Encryption at rest and in transit
- Access controls on personal data

---

## Responsible Alcohol Delivery Practices

### Platform Responsibilities

1. **Age verification** at every relevant touchpoint
2. **Retailer verification** ensures licensed sellers only
3. **Delivery person accountability** via tracking and proof
4. **Order limits** configurable per user (daily/weekly)
5. **Intoxication awareness** — delivery drivers trained to refuse delivery to visibly intoxicated persons
6. **Safe delivery** — contactless options, safe drop-off locations

### Customer-Facing Features

- Age confirmation prompts
- Responsible drinking messaging
- Order history transparency
- Easy order cancellation
- Delivery instructions support

### Retailer Responsibilities

- Maintain valid licenses
- Verify product authenticity
- Proper labeling and packaging
- Temperature-appropriate storage
- Comply with local regulations

---

## Compliance Engine Architecture

```
┌─────────────────────────────────────────────────┐
│                 Checkout Flow                   │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              Compliance Engine                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Load jurisdiction rules                     │
│  2. Validate age verification                   │
│  3. Check retailer license status               │
│  4. Validate delivery date (dry day check)      │
│  5. Validate delivery time (operating hours)    │
│  6. Validate delivery address (zone check)      │
│  7. Validate products (restrictions check)      │
│  8. Validate order limits (if configured)       │
│                                                 │
│  If ALL pass → Proceed to payment               │
│  If ANY fail → Block with explanation           │
│                                                 │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│                Audit Logger                     │
│  Log: user, action, rules, result, timestamp   │
└─────────────────────────────────────────────────┘
```

### Rule Evaluation Order

1. **Hard blocks** — Legal requirements (dry days, age)
2. **Soft blocks** — Store policies (operating hours)
3. **Warnings** — Suggestions (delivery time alternatives)

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "COMPLIANCE_VIOLATION",
    "message": "Order cannot be delivered on this date",
    "details": {
      "rule": "DRY_DAY",
      "jurisdiction": "IL",
      "message": "Alcohol delivery is not permitted on January 1st in Illinois",
      "suggestedDate": "2024-01-02"
    }
  }
}
```

---

## Configurable Rules System

### Admin Interface

- Create, edit, and deactivate rules
- Jurisdiction scoping (state, city, custom)
- Rule type selection
- JSON configuration editor
- Dry day calendar management
- Operating hours template

### Rule Priority

More specific jurisdictions override broader ones:

```
IL (state) → IL/Chicago (city) → IL/Chicago/Downtown (district)
```

### Rule Versioning

- All rule changes versioned
- Previous versions retained
- Effective dates for future rules
- Rollback capability

---

## Admin Compliance Tools

### Dashboard Features

- Compliance check history
- Violation reports
- Retailer license status overview
- Upcoming dry days calendar
- Active rule summary
- Audit log viewer

### Reporting

- Daily compliance summary
- Violation trends
- Retailer compliance scores
- Regulatory report generation

---

## Regulatory Requirements by Jurisdiction

### United States (Examples)

| Jurisdiction | Min Age | Dry Days | Hours | Notes |
|-------------|---------|----------|-------|-------|
| Federal | 21 | None | N/A | TTB oversight |
| California | 21 | None | 6am-2am | ABC regulated |
| New York | 21 | None | 8am-midnight | SLA regulated |
| Illinois | 21 | Some holidays | 7am-10pm | ILCC regulated |
| Texas | 21 | Some holidays | 7am-midnight | TABC regulated |

> **Note**: These are simplified examples. Actual regulations are complex and change frequently. Always verify current requirements with the appropriate regulatory authority.

### International

International jurisdictions have vastly different requirements. The compliance engine supports international configuration but jurisdiction-specific rules must be configured per local law.

---

## Important Disclaimers

1. **Not Legal Advice**: This documentation and the Drinkly platform do not constitute legal advice. Compliance requirements vary by jurisdiction and change frequently.

2. **Your Responsibility**: Retailers, delivery services, and platform operators are responsible for understanding and complying with all applicable laws in their jurisdictions.

3. **Verification Required**: Always verify current regulations with:
   - State alcohol control board
   - Local licensing authority
   - Legal counsel specializing in alcohol beverage law

4. **Platform Limitations**: The compliance engine automates known rules but cannot guarantee compliance with all regulations. Human oversight is required.

5. **Liability**: Drinkly provides tools for compliance management but does not assume liability for regulatory violations by users of the platform.
