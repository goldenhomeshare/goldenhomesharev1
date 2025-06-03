# Golden HomeShare Agreement PDF System

This document outlines the PDF serving and fillable agreement functionality for the official Golden HomeShare agreement in the Golden HomeShare Marketplace.

## Overview

The PDF system provides the ability to:
- Serve the official Golden HomeShare agreement PDF (static)
- Fill the agreement with user-provided information (dynamic)
- View agreements in browser (both static and filled)
- Download agreements as PDF files
- Send agreements via email with attachments
- Display agreements in user-friendly interfaces

## Files Structure

### Core Components
- **`components/AgreementPDFViewer.tsx`** - React component for static PDF interaction
- **`components/FillableAgreementForm.tsx`** - React component for form-based PDF generation
- **`components/ui/separator.tsx`** - UI separator component for form sections
- **`public/homeshare-agreement.pdf`** - The official Golden HomeShare agreement PDF template

### API Routes
- **`app/api/agreements/[agreementId]/pdf/route.ts`** - Serve static PDF files for specific agreements (with auth)
- **`app/api/agreements/[agreementId]/email/route.ts`** - Send static PDFs via email
- **`app/api/agreements/generate-filled/route.ts`** - Generate filled PDFs from form data
- **`app/api/agreements/send-filled/route.ts`** - Generate and send filled PDFs via email
- **`app/api/homeshare-agreement/route.ts`** - Direct access to the static agreement PDF (no auth required)

### Pages
- **`app/homeshare-agreement/page.tsx`** - Dedicated page for viewing the static agreement
- **`app/fill-agreement/page.tsx`** - Form page for generating fillable agreements
- **`app/test-agreements/page.tsx`** - Test page for both static and fillable functionality

## Dependencies

The system uses the following packages:
- **`pdf-lib`** - PDF manipulation for adding text overlays to the static template
- **`@radix-ui/react-separator`** - UI component for form sections
- **`resend`** - Email service (existing)
- **`@kinde-oss/kinde-auth-nextjs`** - Authentication (existing)

## Usage

### Static PDF Viewer

```tsx
import { AgreementPDFViewer } from "@/components/AgreementPDFViewer";

function MyPage() {
  return (
    <AgreementPDFViewer 
      agreementId="your-agreement-id"
      title="Golden HomeShare Agreement"
      description="Official licensing agreement"
      showEmailOption={true}
    />
  );
}
```

### Fillable Agreement Form

```tsx
import { FillableAgreementForm } from "@/components/FillableAgreementForm";

function MyPage() {
  return (
    <FillableAgreementForm 
      title="Complete Your Agreement"
      description="Fill in the details below"
      onFormSubmit={(data) => {
        console.log("Form submitted:", data);
      }}
    />
  );
}
```

### Direct PDF Access

The agreement can be accessed directly at:
- `/api/homeshare-agreement` - Public access to the static PDF
- `/api/agreements/[agreementId]/pdf` - Authenticated access for specific agreements
- `/api/agreements/generate-filled` - POST endpoint for generating filled PDFs
- `/api/agreements/send-filled` - POST endpoint for emailing filled PDFs

## Key Features

### Static PDF Serving
- Uses the official Golden HomeShare agreement PDF
- No dynamic generation required
- Fast loading and consistent content
- Proper caching headers for performance

### Fillable PDF Generation
- Takes user form data and overlays it on the official PDF template
- Supports all major agreement fields (names, addresses, financial terms, dates)
- Validates required fields and email formats
- Handles special conditions and additional notes

### Form Data Structure

```typescript
interface AgreementFormData {
  // Host Information
  hostName: string;
  hostAddress: string;
  hostPhone: string;
  hostEmail: string;
  
  // Seeker Information
  seekerName: string;
  seekerPhone: string;
  seekerEmail: string;
  
  // Property Information
  propertyAddress: string;
  roomDescription: string;
  
  // Financial Terms
  monthlyAmount: string;
  securityDeposit: string;
  
  // Agreement Terms
  moveInDate: string;
  agreementLength: string;
  
  // Additional Information
  specialConditions: string;
  additionalNotes: string;
}
```

### Authentication Options
- Public access via `/api/homeshare-agreement` for static PDF
- Authenticated access via agreement-specific routes
- Required authentication for fillable PDF generation
- Flexible for different use cases

### Email Integration
- Sends PDFs as attachments
- Professional email templates
- Branded with Golden HomeShare information
- Supports both static and filled PDFs

## Navigation Integration

The fillable agreement form is accessible through:
- **Main Navigation:** Resources > Agreement Form
- **Direct URL:** `/fill-agreement`
- **Mobile Menu:** Resources section
- **Desktop User Menu:** Resources dropdown

## Integration Points

### For Hosts
- Add to listing creation flow
- Include in booking confirmation
- Show during application review process
- Display in host dashboard
- Use in tenant onboarding

### For Seekers
- Display during application process
- Show after successful booking
- Include in user onboarding
- Add to user profile/dashboard
- Use for agreement review

### Automated Workflows
- Generate agreements after successful matches
- Email agreements to both parties automatically
- Pre-fill data from user profiles or listing information
- Integrate with booking confirmation emails

## Configuration

### Environment Variables

```bash
RESEND_API_KEY=your_resend_api_key_here
```

### Email Configuration

The email sender is configured in the API routes:

```typescript
from: "agreements@goldenhomeshare.com"
```

### PDF Coordinate Customization

The text overlay positions in the API routes are set as examples. You'll need to adjust these coordinates based on your specific PDF layout:

```typescript
// Example coordinates - adjust for your PDF
addTextOverlay(firstPage, formData.hostName, 150, height - 200, 11, boldFont);
addTextOverlay(firstPage, formData.hostAddress, 150, height - 220, 10);
```

**Important:** Open your PDF in a PDF viewer and note the coordinate positions where you want text to appear. PDF coordinates start from the bottom-left corner.

## Testing

### Test Pages
- `/test-agreements` - Comprehensive test page with tabs for both static and fillable functionality
- `/fill-agreement` - Dedicated fillable form page
- `/homeshare-agreement` - Static agreement display page

### Test Scenarios
1. **Static PDF:** View, download, and email the blank template
2. **Fillable Form:** Complete form with test data and generate personalized PDFs
3. **Form Validation:** Test required field validation and email format checks
4. **Email Functionality:** Test sending agreements to multiple recipients
5. **Preview Mode:** Test PDF preview before download

## Important Legal Information

### License Agreement vs Lease
All arrangements use **license agreements, not leases** - this is intentional for legal protection under Missouri law.

### Local Compliance
Users are responsible for ensuring compliance with local housing codes and municipal requirements.

### Form Validation
The fillable form includes comprehensive validation:
- Required field checks
- Email format validation
- Date format validation
- Numeric validation for financial fields

## Security Considerations

- ✅ Authentication required for fillable PDF generation
- ✅ Public access for general agreement viewing
- ✅ Secure file handling and PDF manipulation
- ✅ Input validation and sanitization
- ✅ Proper HTTP headers and caching
- ✅ Email validation and error handling

## Error Handling

The system includes comprehensive error handling:
- File not found errors (404)
- Authentication errors (401)
- Validation errors (400)
- PDF processing errors (500)
- Email sending errors (500)
- Client-side toast notifications
- Form validation feedback

## Customization

### Updating the Agreement PDF
To update the agreement template:
1. Replace `public/homeshare-agreement.pdf` with the new version
2. Adjust text overlay coordinates in the API routes if layout changed
3. Test all functionality with the new template
4. Update any coordinate references in documentation

### PDF Text Positioning
To customize where text appears on the PDF:
1. Open the PDF and identify desired text positions
2. Convert positions to PDF coordinates (bottom-left origin)
3. Update the `addTextOverlay` calls in the API routes
4. Test with sample data to verify positioning

### Form Fields
To add or modify form fields:
1. Update the `AgreementFormData` interface
2. Add form inputs to `FillableAgreementForm.tsx`
3. Update validation in both client and server
4. Add text overlay positioning in API routes

### Styling
The components can be customized in:
- `components/FillableAgreementForm.tsx` - Form styling and layout
- `components/AgreementPDFViewer.tsx` - PDF viewer styling
- PDF overlay styling in API routes (font, size, color)

## Future Enhancements

Potential improvements:
1. **Digital Signatures** - Add e-signature capability using services like DocuSign
2. **Template System** - Support multiple agreement templates
3. **Auto-Fill Integration** - Pre-populate forms from user profiles
4. **Agreement Versions** - Track different versions over time
5. **Batch Processing** - Generate multiple agreements at once
6. **Advanced Validation** - Custom validation rules per field
7. **PDF Form Fields** - Use actual PDF form fields instead of overlays
8. **Mobile Optimization** - Improve mobile form experience
9. **Agreement Tracking** - Log views, downloads, and completions
10. **Integration APIs** - RESTful APIs for external integrations

## Migration Notes

This system was updated from a dynamic PDF generation system to include both static and fillable PDF capabilities. Key changes:

### Added
- **PDF-lib dependency** for PDF manipulation
- **Fillable form component** with comprehensive validation
- **Form-based PDF generation** API routes
- **Email functionality** for filled PDFs
- **Navigation integration** for easy access
- **Comprehensive testing** pages

### Enhanced
- **Static PDF serving** with better caching
- **Email templates** with richer formatting
- **Error handling** throughout the system
- **Documentation** with usage examples

### Preserved
- All existing static PDF functionality
- Email sending capabilities
- Authentication patterns
- Error handling structures
- Component interfaces

The system now provides a complete solution for both viewing the standard agreement and generating personalized agreements with user data. 