# PDF Coordinate Testing Tool

## Quick Coordinate Testing

To find the exact positions for your Golden HomeShare PDF fields, temporarily add these test markers to see where different coordinates appear on your PDF.

### Step 1: Add Test Markers

Add these lines temporarily to your API route (in the "PAGE 1 FIELDS" section):

```typescript
// ==================== COORDINATE TEST MARKERS ====================
// Add these temporarily to see where coordinates are positioned
// Remove after finding correct positions

// Grid markers to help locate areas
addTextOverlay(page1, "TOP-LEFT (50,50)", 50, p1Height - 50, 10, boldFont);
addTextOverlay(page1, "TOP-CENTER", p1Width/2 - 50, p1Height - 50, 10, boldFont);
addTextOverlay(page1, "TOP-RIGHT", p1Width - 150, p1Height - 50, 10, boldFont);

addTextOverlay(page1, "MID-LEFT", 50, p1Height/2, 10, boldFont);
addTextOverlay(page1, "CENTER", p1Width/2 - 30, p1Height/2, 10, boldFont);
addTextOverlay(page1, "MID-RIGHT", p1Width - 100, p1Height/2, 10, boldFont);

addTextOverlay(page1, "BOTTOM-LEFT", 50, 100, 10, boldFont);
addTextOverlay(page1, "BOTTOM-CENTER", p1Width/2 - 50, 100, 10, boldFont);
addTextOverlay(page1, "BOTTOM-RIGHT", p1Width - 150, 100, 10, boldFont);

// Test specific Y positions (distance from top)
addTextOverlay(page1, "Y=75 (1\" from top)", 50, p1Height - 75, 9, font);
addTextOverlay(page1, "Y=150 (2\" from top)", 50, p1Height - 150, 9, font);
addTextOverlay(page1, "Y=225 (3\" from top)", 50, p1Height - 225, 9, font);
addTextOverlay(page1, "Y=300 (4\" from top)", 50, p1Height - 300, 9, font);

// Test specific X positions (distance from left)
addTextOverlay(page1, "X=72 (1\")", 72, p1Height - 400, 9, font);
addTextOverlay(page1, "X=144 (2\")", 144, p1Height - 400, 9, font);
addTextOverlay(page1, "X=216 (3\")", 216, p1Height - 400, 9, font);
addTextOverlay(page1, "X=288 (4\")", 288, p1Height - 400, 9, font);

// Test coordinates near where we think fields should be
addTextOverlay(page1, "TEST PROPERTY ADDRESS", 170, p1Height - 75, 10, boldFont);
addTextOverlay(page1, "TEST $600", 170, p1Height - 175, 12, boldFont);
addTextOverlay(page1, "TEST $400", 170, p1Height - 210, 10, font);
addTextOverlay(page1, "TEST DATE", 170, p1Height - 312, 10, font);
addTextOverlay(page1, "TEST 12 MONTHS", 170, p1Height - 347, 10, font);
addTextOverlay(page1, "TEST SIG DATE LEFT", 170, p1Height - 635, 10, font);
addTextOverlay(page1, "TEST SIG DATE RIGHT", 400, p1Height - 635, 10, font);
```

### Step 2: Generate Test PDF

1. Go to `/test-agreements`
2. Fill out the form with any test data
3. Generate a PDF to see where all the markers appear
4. Compare with your actual PDF to identify correct field positions

### Step 3: Identify Correct Positions

Look at the generated test PDF and note:
- Which marker is closest to where the property address should go
- Which marker is closest to where the monthly amount should go
- Which marker is closest to where the signature dates should go
- etc.

### Step 4: Update Coordinates

Based on the test markers, adjust the coordinates in both API files:

```typescript
// Example adjustments based on test results:

// If "TEST PROPERTY ADDRESS" appeared in the right place:
addTextOverlay(page1, formData.propertyAddress, 170, p1Height - 75, 12, boldFont);

// If it was too far right, move it left:
addTextOverlay(page1, formData.propertyAddress, 120, p1Height - 75, 12, boldFont);

// If it was too low, move it up:
addTextOverlay(page1, formData.propertyAddress, 170, p1Height - 50, 12, boldFont);
```

## Common Field Positions (based on your PDF image)

From your screenshot, I can see these approximate positions:

### Page 1 - Main Fields:
```typescript
// Property Address (top area)
addTextOverlay(page1, formData.propertyAddress, 170, p1Height - 75, 12, boldFont);

// Monthly Amount (seems to be around here)
addTextOverlay(page1, formatCurrency(formData.monthlyAmount), 170, p1Height - 175, 14, boldFont);

// Security Deposit (below monthly amount)
addTextOverlay(page1, formatCurrency(formData.securityDeposit), 170, p1Height - 210, 12, font);

// Move-in Date
addTextOverlay(page1, formatDate(formData.moveInDate), 170, p1Height - 312, 12, font);

// Agreement Length
addTextOverlay(page1, agreementLength, 170, p1Height - 347, 12, font);

// Signature Dates (bottom)
addTextOverlay(page1, currentDate, 170, p1Height - 635, 12, font);  // Left
addTextOverlay(page1, currentDate, 400, p1Height - 635, 12, font);  // Right
```

## Fine-Tuning Tips

### For Property Address:
- If too high: increase the Y offset (p1Height - 100 instead of p1Height - 75)
- If too low: decrease the Y offset (p1Height - 50)
- If too left: increase X coordinate (200 instead of 170)
- If too right: decrease X coordinate (120 instead of 170)

### For Financial Fields:
- These might need to be in specific boxes or areas
- Try different X positions: 150, 170, 200, 250
- Try different Y positions based on PDF layout

### For Dates:
- Signature dates are typically at the bottom
- Try Y positions around: p1Height - 600, p1Height - 635, p1Height - 670

## Remove Test Markers

Once you find the correct positions:
1. Remove all the test marker code
2. Update the actual field coordinates
3. Test with real data to confirm positioning

## Page 2 Testing

For page 2 fields (Room Description, Special Conditions):

```typescript
// Test markers for page 2
addTextOverlay(page2, "PAGE 2 TOP", 50, p2Height - 50, 12, boldFont);
addTextOverlay(page2, "ROOM DESC AREA", 110, p2Height - 120, 10, font);
addTextOverlay(page2, "SPECIAL COND AREA", 110, p2Height - 200, 10, font);
addTextOverlay(page2, "NOTES AREA", 110, p2Height - 300, 10, font);
```

This systematic approach will help you find the exact coordinates for your specific PDF layout! 