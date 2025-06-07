import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { readFileSync } from "fs";
import { join } from "path";
import type { AgreementFormData } from "@/components/FillableAgreementForm";

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData: AgreementFormData = await request.json();
    console.log("Received form data for PDF generation:", JSON.stringify(formData, null, 2));

    // Validate required fields
    const requiredFields = ['hostName', 'hostEmail', 'seekerName', 'seekerEmail', 'propertyAddress', 'monthlyAmount', 'moveInDate'];
    for (const field of requiredFields) {
      if (!formData[field as keyof AgreementFormData]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    console.log("Starting PDF generation...");
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Load and embed logo
    let logoImage: any = null;
    try {
      const logoPath = join(process.cwd(), 'public', 'logo.png');
      const logoBytes = readFileSync(logoPath);
      logoImage = await pdfDoc.embedPng(logoBytes);
    } catch (error) {
      console.warn('Logo not found, proceeding without logo');
    }

    // Color definitions
    const primaryColor = rgb(0.2, 0.3, 0.7); // Blue for headers
    const highlightColor = rgb(0.9, 0.9, 0.2); // Yellow background for filled fields
    const filledTextColor = rgb(0.1, 0.1, 0.8); // Dark blue for filled text

    // Helper functions for formatting
    const formatCurrency = (amount: string) => {
      if (!amount) return '$0';
      try {
        const num = parseFloat(amount) || 0;
        return `$${num.toLocaleString()}`;
      } catch (error) {
        console.warn('Error formatting currency:', amount, error);
        return '$0';
      }
    };

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', dateStr);
          return '';
        }
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      } catch (error) {
        console.warn('Error formatting date:', dateStr, error);
        return '';
      }
    };

    // Calculate end date based on agreement length
    const calculateEndDate = (startDate: string, agreementLength: string) => {
      if (!startDate) return '';
      try {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          console.warn('Invalid start date:', startDate);
          return '';
        }
        
        if (agreementLength === 'month-to-month') {
          const end = new Date(start);
          end.setFullYear(end.getFullYear() + 1);
          return end.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } else {
          const months = parseInt(agreementLength) || 12;
          const end = new Date(start);
          end.setMonth(end.getMonth() + months);
          return end.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      } catch (error) {
        console.warn('Error calculating end date:', startDate, agreementLength, error);
        return '';
      }
    };

    // Helper to add text with wrapping
    // Helper function to sanitize text for PDF rendering
    const sanitizeTextForPDF = (text: string): string => {
      if (!text) return '';
      
      // Replace problematic Unicode characters with ASCII equivalents
      return text
        .replace(/✓/g, 'X') // Replace checkmarks with X
        .replace(/✗/g, ' ') // Replace X marks with space
        .replace(/[""]/g, '"') // Replace smart quotes
        .replace(/['']/g, "'") // Replace smart apostrophes
        .replace(/–/g, '-') // Replace en dash
        .replace(/—/g, '--') // Replace em dash
        .replace(/[^\x00-\x7F]/g, '?'); // Replace any remaining non-ASCII with ?
    };

    const addText = (page: any, text: string, x: number, y: number, fontSize = 10, fontType = font, maxWidth = 500, color = rgb(0, 0, 0)) => {
      if (!text || !text.trim() || text === 'undefined' || text === 'null') return y;
      
      // Sanitize text to prevent encoding issues
      const sanitizedText = sanitizeTextForPDF(text.trim());
      const words = sanitizedText.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        try {
          if (fontType.widthOfTextAtSize(testLine, fontSize) <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              lines.push(word);
            }
          }
        } catch (error) {
          console.warn('Error calculating text width:', error, 'Text:', testLine);
          // Fallback to just adding the word
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            lines.push(word);
          }
        }
      }
      if (currentLine) lines.push(currentLine);
      
      let currentY = y;
      for (const line of lines) {
        try {
          page.drawText(line, { x, y: currentY, size: fontSize, font: fontType, color });
          currentY -= fontSize + 2;
        } catch (error) {
          console.warn('Error drawing text:', error, 'Text:', line);
          currentY -= fontSize + 2; // Still advance Y position
        }
      }
      return currentY - 5;
    };

    // Helper to add filled field with highlighting
    const addFilledField = (page: any, text: string, x: number, y: number, fontSize = 10, maxWidth = 500) => {
      if (!text) return y;
      
      // Calculate text dimensions for background
      const textWidth = boldFont.widthOfTextAtSize(text, fontSize);
      const textHeight = fontSize + 4;
      
      // Draw background highlight
      page.drawRectangle({
        x: x - 2,
        y: y - 2,
        width: Math.min(textWidth + 4, maxWidth),
        height: textHeight,
        color: highlightColor,
      });
      
      // Draw the text
      return addText(page, text, x, y, fontSize, boldFont, maxWidth, filledTextColor);
    };

    // Helper to add logo and header
    const addPageHeader = (page: any, y: number) => {
      let currentY = y;
      
      // Add logo if available - smaller and better positioned
      if (logoImage) {
        const logoScale = 0.15; // Smaller logo
        const logoDims = logoImage.scale(logoScale);
        page.drawImage(logoImage, {
          x: 40,
          y: currentY - logoDims.height,
          width: logoDims.width,
          height: logoDims.height,
        });
        
        // Add company name next to logo with professional spacing
        page.drawText('Golden HomeShare', {
          x: 40 + logoDims.width + 12,
          y: currentY - 12,
          size: 12,
          font: boldFont,
          color: primaryColor,
        });
        
        currentY -= logoDims.height + 15;
      } else {
        // Fallback without logo - centered
        const pageWidth = 612;
        const textWidth = boldFont.widthOfTextAtSize('Golden HomeShare', 12);
        const centerX = (pageWidth - textWidth) / 2;
        page.drawText('Golden HomeShare', {
          x: centerX,
          y: currentY,
          size: 12,
          font: boldFont,
          color: primaryColor,
        });
        currentY -= 25;
      }
      
      return currentY;
    };

    // =========================== PAGE 1 - TITLE PAGE ===========================
    const page1 = pdfDoc.addPage([612, 792]);
    let y = 680; // Start a bit lower for better balance
    const pageWidth = 612;
    
    // Professional title page layout
    if (logoImage) {
      const logoScale = 0.3; // Smaller, more professional logo
      const logoDims = logoImage.scale(logoScale);
      const logoX = (pageWidth - logoDims.width) / 2; // Center horizontally
      
      page1.drawImage(logoImage, {
        x: logoX,
        y: y - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
      });
      
      y -= logoDims.height + 50;
    }
    
    // Centered title styling with proper measurements
    const companyNameWidth = boldFont.widthOfTextAtSize('Golden HomeShare', 20);
    const companyNameX = (pageWidth - companyNameWidth) / 2;
    page1.drawText('Golden HomeShare', {
      x: companyNameX,
      y: y,
      size: 20,
      font: boldFont,
      color: primaryColor,
    });
    y -= 35;
    
    const titleWidth = boldFont.widthOfTextAtSize('Limited License Agreement', 18);
    const titleX = (pageWidth - titleWidth) / 2;
    page1.drawText('Limited License Agreement', {
      x: titleX,
      y: y,
      size: 18,
      font: boldFont,
      color: primaryColor,
    });
    y -= 50;
    
    // Professional decorative line - centered and proportional
    const lineWidth = 250;
    const lineX = (pageWidth - lineWidth) / 2;
    page1.drawLine({
      start: { x: lineX, y: y },
      end: { x: lineX + lineWidth, y: y },
      thickness: 2,
      color: primaryColor,
    });

    // =========================== PAGE 2 - SECTIONS 1-3 ===========================
    const page2 = pdfDoc.addPage([612, 792]);
    y = 750; // Better starting position
    y = addPageHeader(page2, y);
    y -= 40; // More professional spacing after header

    // Section 1. Parties - EXACT TEXT with field insertions and styling
    y = addText(page2, 'Section 1. Parties', 60, y, 12, boldFont, 500, primaryColor);
    y -= 18; // Better section spacing
    let text = `This Limited License Agreement (this "Agreement") is made on ${formatDate(formData.moveInDate)} (the "Effective Date") between ${formData.hostName} ("Licensor"), and ${formData.seekerName} ("Licensee"). Licensor and Licensee agree to comply with the terms and conditions of this Agreement at all times during the Term (defined in Section 3.B).`;
    y = addText(page2, text, 60, y, 10, font, 490); // Better text width
    y -= 15; // More space between sections

    // Section 2. Property - EXACT TEXT with field insertions and styling
    y = addText(page2, 'Section 2. Property', 60, y, 12, boldFont, 500, primaryColor);
    y -= 15;

    y = addText(page2, 'A. Residence.', 60, y, 10, boldFont, 500, primaryColor);
    text = `Licensor owns or leases the residence located at ${formData.propertyAddress} ("Residence"). If Licensor leases the Residence, Licensee should request a copy of the lease agreement between Licensor and the landlord. Licensee agrees to comply with the terms of that lease agreement (other than paying rent to the landlord, which is Licensor's responsibility).`;
    y = addText(page2, text, 80, y, 10, font, 470); // Better indentation and width
    y -= 8;

    y = addText(page2, 'B. Licensee Areas.', 60, y, 10, boldFont, 500, primaryColor);
    text = `Licensor agrees that Licensee will have the right to use and occupy the bedroom(s) and other areas identified by Licensor in the Property Addendum attached to this Agreement ("Licensee Areas"). Licensor agrees not to access, or attempt to access, the Licensee Areas, except in accordance with this Agreement.`;
    y = addText(page2, text, 80, y, 10, font, 470);
    y -= 8;

    y = addText(page2, 'C. Shared Areas.', 60, y, 10, boldFont, 500, primaryColor);
    text = `Licensor agrees that Licensee will have the right, in common with Licensor, to use and occupy shared areas within the Residence that are identified by Licensor in the Property Addendum ("Shared Areas"). The Licensee Areas and the Shared Areas are referred to as the "Accessible Property". Licensor and Licensee agree to be respectful of each other in using the Shared Areas. When using the Shared Areas, Licensor and Licensee will each clean-up after themselves and keep such Shared Areas neat and clean at all times. Licensee agrees not to access, or attempt to access, any part of the Residence other than the Accessible Property without Licensor's permission.`;
    y = addText(page2, text, 80, y, 10, font, 470);
    y -= 8;

    y = addText(page2, 'D. House Rules.', 60, y, 10, boldFont, 500, primaryColor);
    text = `Licensor and Licensee agree to comply with the "House Rules" included in the Property Addendum ("House Rules").`;
    y = addText(page2, text, 80, y, 10, font, 470);
    y -= 15;

    // Section 3. Term - EXACT TEXT with field insertions and styling
    y = addText(page2, 'Section 3. Term', 60, y, 12, boldFont, 500, primaryColor);
    y -= 15;

    y = addText(page2, 'A. Start Date and End Date.', 60, y, 10, boldFont, 500, primaryColor);
    const endDate = calculateEndDate(formData.moveInDate, formData.agreementLength || '12');
    text = `The initial term of this Agreement ("Initial Term") will begin on ${formatDate(formData.moveInDate)} ("Start Date") and will end on ${endDate} ("End Date"). Upon the End Date, Licensee shall be required to vacate the Residence unless Licensor and Licensee extend this Agreement in writing or create and execute a new, written Homesharing Agreement ("Extended Term"). "Term" means the Initial Term and the Extended Term, if applicable.`;
    y = addText(page2, text, 80, y, 10, font, 470);

    // =========================== PAGE 3 - SECTIONS 3 (CONT'D), 4, 5 ===========================
    const page3 = pdfDoc.addPage([612, 792]);
    y = 750;
    y = addPageHeader(page3, y);
    y -= 40;

    // Section 3.B - EXACT TEXT
    y = addText(page3, 'B. Termination Rights.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensor and Licensee each have the right to terminate this Agreement at any time by delivering a written termination notice ("Termination Notice") to the other party. The Termination Notice must state the date that this Agreement will terminate, which must be at least 30 days after the date that the Termination Notice is given. If either party delivers a Termination Notice, the "End Date" will be the termination date stated in the Termination Notice.`;
    y = addText(page3, text, 70, y, 10, font, 480);
    y -= 5;

    // Section 3.C - EXACT TEXT
    y = addText(page3, 'C. Moving In.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensee is permitted to move in to the Licensee Areas and begin using the Shared Areas on the Start Date. Licensor will give Licensee any keys or other access devices needed for Licensee to access the Residence on or before the Start Date.`;
    y = addText(page3, text, 70, y, 10, font, 480);
    y -= 5;

    // Section 3.D - EXACT TEXT
    y = addText(page3, 'D. Moving Out.', 50, y, 10, boldFont, 500, primaryColor);
    text = `On or before the End Date, Licensee must (i) remove all personal property from the Residence, (ii) notify Licensor of any damage Licensee caused to the Property or the Residence (unless notice has been given under Section 6.A), and (iii) deliver keys, garage door openers and other access devices to Licensor.`;
    y = addText(page3, text, 70, y, 10, font, 480);
    y -= 5;

    // Section 3.E - EXACT TEXT
    y = addText(page3, 'E. Holding Over.', 50, y, 10, boldFont, 500, primaryColor);
    text = `If Licensee fails to vacate the Property on or before the End Date, such failure will be Licensee Default (defined in Section 10.A) and Licensor will have all remedies stated in Section 10.A. Additionally, Licensee will be liable to Licensor for damages caused by failing to move out. During the period between the End Date and the date that Licensee moves out, the License Fee will be increased by 50% unless Licensor agrees in writing to a different License Fee amount, and Licensee will pay the increased License Fee on demand.`;
    y = addText(page3, text, 70, y, 10, font, 480);
    y -= 10;

    // Section 4. Security Deposit - EXACT TEXT with field insertion and styling
    y = addText(page3, 'Section 4. Security Deposit', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    const securityDepositAmount = formData.securityDeposit && formData.securityDeposit !== '0' ? formatCurrency(formData.securityDeposit) : formatCurrency('0');
    text = `On the Effective Date, Licensee must pay to Licensor ${securityDepositAmount} ("Security Deposit"). Licensor may apply the Security Deposit to any costs paid as a result of Licensee's breach of this Agreement. The Security Deposit (less any amounts applied by Licensor) will be returned to Licensee within 30 days after the End Date.`;
    y = addText(page3, text, 50, y, 10, font);
    y -= 15;

    // Section 5. License Fee - EXACT TEXT with field insertion and styling
    y = addText(page3, 'Section 5. License Fee', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `The license fee for the Initial Term is ${formatCurrency(formData.monthlyAmount)} per calendar month ("License Fee"). Licensee must pay License Fee for the first month of the Initial Term on the Effective Date, and before the first day of each month for the rest of the Term. License Fee includes Licensee's share of utilities and other expenses relating to the Property, but does not include late charges, returned-check charges, or costs of repairs for damage to the Residence caused by Licensee (collectively, "Additional License Fee"). Licensor may report unpaid License Fee, charges, or damages to credit reporting`;
    y = addText(page3, text, 50, y, 10, font);

    // =========================== PAGE 4 - SECTIONS 5 (CONT'D), 6, 7 ===========================
    const page4 = pdfDoc.addPage([612, 792]);
    y = 750;
    y = addPageHeader(page4, y);
    y -= 40;

    // Continue Section 5 - EXACT TEXT
    text = `agencies. All License Fee shall be prorated for any partial calendar month, notwithstanding the foregoing, if Licensee sends a Termination Notice or moves out prior to the End Date, Licensee will not receive a refund of any portion of the License Fee.`;
    y = addText(page4, text, 50, y, 10, font);
    y -= 10;

    // Section 6. Repairs and Maintenance - EXACT TEXT
    y = addText(page4, 'Section 6. Repairs and Maintenance', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;

    y = addText(page4, 'A. Move-In Condition.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensee has inspected and accepts the Residence in its "as is" condition, and agrees that Licensor has made no express or implied warranties about the condition of the Residence and no agreements have been made about future repairs unless specified in this Agreement. Licensee may notify Licensor in writing of any defects in or damage to the Residence within forty-eight (48) hours after the Start Date of this Agreement; however, such notice does not constitute a request for repairs or maintenance. If Licensee does not deliver such notice in accordance with this Section 3.C, Licensee will be deemed to agree that the Residence is in good condition and no repairs or maintenance are necessary.`;
    y = addText(page4, text, 70, y, 10, font, 480);
    y -= 5;

    y = addText(page4, 'B. Licensee Obligations.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensee will be responsible for keeping the Licensee Areas neat and clean. Licensee will not make any alterations to the Residence or damage any part of the Residence. Licensee will promptly notify Licensor in writing of any maintenance or repairs Licensee believes are needed within the Licensee Areas or the Shared Areas, but will not perform maintenance or repairs without the approval of Licensor.`;
    y = addText(page4, text, 70, y, 10, font, 480);
    y -= 5;

    y = addText(page4, 'C. Licensor Obligations.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensor will be responsible for maintenance and repairs of the Residence, and will promptly pay all costs relating to such maintenance and repairs, except as provided in Section 6.A. Licensor will respond to Licensee within a reasonable period of time after receiving written notice from Licensee regarding maintenance or repairs (and will promptly perform maintenance and repairs to the extent necessary to comply with Licensor's obligations under this Agreement)`;
    y = addText(page4, text, 70, y, 10, font, 480);
    y -= 10;

    // Section 7. Use of the Residence - EXACT TEXT
    y = addText(page4, 'Section 7. Use of the Residence', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;

    y = addText(page4, 'A. Occupants.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensee will not permit any other person to occupy the Residence during the Term unless Licensor agrees in writing. Licensee will not sublease the Residence or assign this Agreement to any other person, and any attempted sublease or assignment will be void.`;
    y = addText(page4, text, 70, y, 10, font, 480);
    y -= 5;

    y = addText(page4, 'B. Legal Requirements.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensee will comply with all applicable laws affecting Licensee, Licensor and/or the Residence, and with all Licensors' association rules and restrictive covenants affecting the Residence (collectively, "Legal Requirements"). Licensee will reimburse Licensor, within 10 days of demand, for`;
    y = addText(page4, text, 70, y, 10, font, 480);

    // =========================== PAGE 5 - SECTIONS 7 (CONT'D), 8, 9 ===========================
    const page5 = pdfDoc.addPage([612, 792]);
    y = 750;
    y = addPageHeader(page5, y);
    y -= 40;

    // Continue Section 7.B - EXACT TEXT
    text = `any fees, fines or other charges assessed against Licensor for Licensee's violation of this Section 7.B.`;
    y = addText(page5, text, 50, y, 10, font);
    y -= 5;

    y = addText(page5, 'C. Restrictions.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensee will not permit any part of the Residence to be used for (1) any activity that is offensive, noisy, or dangerous, or otherwise constitutes a nuisance, (2) the repair of any vehicle, (3) any business of any type (but this will not prevent Licensee from working for Licensee's employer within the Licensee Areas), or (4) any illegal or unlawful activity or other activity that will obstruct, interfere with, or infringe on the rights of Licensor or other persons near the Residence.`;
    y = addText(page5, text, 70, y, 10, font, 480);
    y -= 5;

    y = addText(page5, 'D. Guests and Pets.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensee will comply with the House Rules relating to guests and pets. Licensee will at all times be solely responsible for Licensee's guests and pets, and will ensure that all guests comply with this Agreement, including the House Rules, while they are at the Residence.`;
    y = addText(page5, text, 70, y, 10, font, 480);
    y -= 5;

    y = addText(page5, 'E. Insurance.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Licensee must carry renters insurance providing coverage for Licensee's personal property.`;
    y = addText(page5, text, 70, y, 10, font, 480);
    y -= 10;

    // Section 8. Access by Licensor - EXACT TEXT
    y = addText(page5, 'Section 8. Access by Licensor', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `Licensor or anyone authorized by Licensor may enter the Licensee Areas at reasonable times to (a) inspect the condition of the Licensee Areas, (b) perform maintenance and repairs to the Residence, (c) exercise Licensor's rights or remedies under this Agreement, or (d) in the event of an emergency, to protect Licensor, Licensee and/or the Residence (or any personal property within the Residence). Licensor will give reasonable advance notice to Licensee prior to any access of the Licensee Areas, unless such access is for purposes described in subsection (c) or (d). To the extent that Licensor provides Licensee with keys or other access devices for any part of the Licensee Areas, Licensor is entitled to retain a key or access device to access the Licensee Areas in accordance with this Section 8.`;
    y = addText(page5, text, 50, y, 10, font);
    y -= 10;

    // Section 9. Liability - EXACT TEXT
    y = addText(page5, 'Section 9. Liability', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `Subject to the Property Laws (defined in Section 12), Licensor will not be responsible to Licensee or Licensee's guests for any damages, injuries, or losses to person or property caused by fire, flood, water leaks, ice, snow, hail, winds, explosion, smoke, interruption of utilities, theft, burglary, robbery, assault, vandalism, other persons, condition of the Residence, or other occurrences or casualty losses. Licensee will promptly reimburse Licensor for any loss, property damage, or cost of repairs or service to the Residence caused by negligence or by improper use by Licensee or Licensee's guests. Licensor may require advance payment of repairs for which Licensee is liable.`;
    y = addText(page5, text, 50, y, 10, font);

    // =========================== PAGE 6 - SECTIONS 9 (CONT'D), 10 ===========================
    const page6 = pdfDoc.addPage([612, 792]);
    y = 750;
    y = addPageHeader(page6, y);
    y -= 40;

    // Continue Section 9 - EXACT TEXT
    text = `Licensee should secure renters insurance and/other insurance coverages for protection against liabilities and losses.`;
    y = addText(page6, text, 50, y, 10, font);
    y -= 15;

    // Section 10. Default; Remedies - EXACT TEXT
    y = addText(page6, 'Section 10. Default; Remedies', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;

    y = addText(page6, 'A. Licensee Defaults.', 50, y, 10, boldFont, 500, primaryColor);
    text = `In addition to the Licensee Defaults stated above (which are automatic and do not require notice), if Licensee fails to comply with any term or condition of this Agreement, and such failure is not cured within three (3) business days following written notice from Licensor (each, a "Licensee Default"), Licensor will be entitled to take any of the following actions:`;
    y = addText(page6, text, 70, y, 10, font, 480);
    y -= 5;

    y = addText(page6, '1. Termination.', 70, y, 10, boldFont, 500, primaryColor);
    text = `Licensor may terminate this Agreement by written notice to Licensee, in which event the "End Date" is the date that Licensee receives such notice; provided, however, that Licensee will have 3 days to vacate the Residence and surrender all rights to the Residence in accordance with the requirements of Section 3.D.`;
    y = addText(page6, text, 90, y, 10, font, 460);
    y -= 5;

    y = addText(page6, '2. Legal Action.', 70, y, 10, boldFont, 500, primaryColor);
    text = `Licensor may file a lawsuit against Licensee for breach of contract and/or any other cause of action in accordance with applicable laws.`;
    y = addText(page6, text, 90, y, 10, font, 460);
    y -= 5;

    y = addText(page6, '3. Removal.', 70, y, 10, boldFont, 500, primaryColor);
    text = `Licensor may take any action permitted under applicable laws to remove Licensee and Licensee's personal property from the Residence, including changing locks, access codes, and other means of entrance and egress. Subject to Section 11 and Section 13, in the event that Licensor is required to comply with any Tenancy Laws (defined in Section 11) or other Property Laws, Licensor will exercise this remedy in accordance with such laws.`;
    y = addText(page6, text, 90, y, 10, font, 460);
    y -= 5;

    y = addText(page6, 'B. Licensor Defaults.', 50, y, 10, boldFont, 500, primaryColor);
    text = `If Licensor fails to comply with any term or condition of this Agreement, and such failure is not cured within three (3) business days following written notice from Licensee (each, a "Licensor Default"), Licensee may terminate this Agreement by written notice to Licensor, in which event the "End Date" is the date that Licensor receives such notice; provided, however, that Licensee will have 3 business days to vacate the Residence and surrender the Residence in accordance with the requirements of Section 3.D. If Licensee terminates due to an Licensor Default, the License Fee for the month in which the End Date occurs will be prorated on a day for day basis, and Licensor will refund an amount equal to the prorated License Fee for the period between the End Date and the last day of such calendar month. Any refund will be paid at the time the Security Deposit is returned to Licensee in accordance with Section 4.`;
    y = addText(page6, text, 70, y, 10, font, 480);

    // =========================== PAGE 7 - SECTIONS 10 (CONT'D), 11, 12 ===========================
    const page7 = pdfDoc.addPage([612, 792]);
    y = 750;
    y = addPageHeader(page7, y);
    y -= 40;

    // Continue Section 10.B - EXACT TEXT
    text = `The remedies in this Section 10.B are Licensee's sole remedies for an Licensor Default.`;
    y = addText(page7, text, 50, y, 10, font);
    y -= 10;

    // Section 11. License Agreement for Shared Occupancy - EXACT TEXT
    y = addText(page7, 'Section 11. License Agreement for Shared Occupancy', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `Licensor and Licensee intend for this Agreement to be a revocable license for shared occupancy agreement, and do not intend to create a landlord-tenant relationship or any other relationship subject to landlord tenancy laws of the State, County, municipality, or other political subdivision in which the Residence is located (collectively, "Tenancy Laws"). The Licensor retains full legal possession of the Residence and grants the Licensee a limited, non-exclusive right to occupy designated areas of the Residence for the duration of the Term.`;
    y = addText(page7, text, 50, y, 10, font);
    y -= 10;

    // Section 12. Property Laws - EXACT TEXT
    y = addText(page7, 'Section 12. Property Laws', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `Licensor and Licensee intend for this Agreement to comply with applicable laws. However, to the extent that Tenancy Laws, or any other applicable laws governing residential real property and/or short-term shared occupancy agreements similar to this Agreement (collectively, "Property Laws"), are permitted to be waived, modified or altered by this Agreement, Licensor and Licensee intend and agree (a) that if any Property Law contains (i) terms, conditions, or obligations that cannot be waived, modified or altered by agreement of Licensor and Licensee, or (ii) requirements that must be set forth in short-term occupancy agreements similar to this Agreement in order for the same to be valid and enforceable, such Property Law (or term, condition, obligation or requirement) is incorporated into this Agreement by reference, (b) to waive any term, condition or obligation of any Property Law to fullest extent allowable, and (c) if there is a conflict between this Agreement and any Property Law that may be modified or altered by agreement between Licensor and Licensee, this Agreement shall control. Licensor and Licensee agree that this Section 12 is intended to supplement, not supersede, Section 11.`;
    y = addText(page7, text, 50, y, 10, font);
    y -= 10;

    // Section 13. Golden HomeShare Platform - EXACT TEXT
    y = addText(page7, 'Section 13. Golden HomeShare Platform', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `Licensor and Licensee are both members of Golden HomeShare, a secure platform that may be used to match Licensors with potentially compatible Licensees (the "Platform"). Licensors and Licensees each represent and warrant to Golden HomeShare, that they have read and understand the Terms of Use ("TOU").`;
    y = addText(page7, text, 50, y, 10, font);
    y -= 10;

    // Section 14. Governing Law - EXACT TEXT
    y = addText(page7, 'Section 14. Governing Law', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `This Agreement will be governed by and interpreted under the laws of the State where the Residence is located, regardless of any conflict-of-law rules. All obligations of this Agreement are to be performed in the county in which the Residence is located.`;
    y = addText(page7, text, 50, y, 10, font);

    // =========================== PAGE 8 - SECTIONS 15, 16, 17, 18 & SIGNATURES ===========================
    const page8 = pdfDoc.addPage([612, 792]);
    y = 750;
    y = addPageHeader(page8, y);
    y -= 40;

    // Section 15. Entire Agreement, Binding Effect, Waivers and Notices - EXACT TEXT
    y = addText(page8, 'Section 15. Entire Agreement, Binding Effect, Waivers and Notices', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `This Agreement (including the Property Addendum) represents the entire agreement between Licensor and Licensee. Any clause in this Agreement declared invalid by law will not terminate or invalidate the rest of this Agreement.`;
    y = addText(page8, text, 50, y, 10, font);
    y -= 5;
    text = `This is intended to be a legal agreement binding after final acceptance. Read it carefully. If you do not understand the effect of this agreement, consult an attorney before signing.`;
    y = addText(page8, text, 50, y, 10, font);
    y -= 10;

    // Section 16. Involvement of Golden HomeShare in Agreement - EXACT TEXT
    y = addText(page8, 'Section 16. Involvement of Golden HomeShare in Agreement', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;

    y = addText(page8, 'A.', 50, y, 10, boldFont, 500, primaryColor);
    text = `Golden HomeShare is not a party to this Agreement. This Agreement is solely between the Licensor and the Licensee. Golden HomeShare does not act as a landlord, property manager, real estate broker, or legal representative of either party. Golden HomeShare is not responsible for enforcing the terms of this Agreement, resolving disputes, or ensuring the performance of either party. By using the Golden HomeShare platform, Licensor and Licensee acknowledge that all legal and financial responsibilities arising from this Agreement rest solely with the parties signing below.`;
    y = addText(page8, text, 70, y, 10, font, 480);
    y -= 5;

    y = addText(page8, 'B.', 50, y, 10, boldFont, 500, primaryColor);
    text = `At the request of either party, Golden HomeShare may, at its sole discretion, offer informal mediation services to help facilitate communication and resolution of disputes between Licensor and Licensee. However, Golden HomeShare does not guarantee that mediation will result in a resolution, or that either party will be satisfied with the outcome. Participation in any mediation provided by Golden HomeShare is voluntary and non-binding.`;
    y = addText(page8, text, 70, y, 10, font, 480);
    y -= 10;

    // Section 17. Waiver of Jury Trial, Set-Off or Counterclaim - EXACT TEXT
    y = addText(page8, 'Section 17. Waiver of Jury Trial, Set-Off or Counterclaim.', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `The parties hereto waive trial by jury in all matters except for personal injury or property damage claims. In a summary proceeding for eviction, Licensee waives Licensee 's right to any set-off and/or counterclaim.`;
    y = addText(page8, text, 50, y, 10, font);
    y -= 10;

    // Section 18. Amendments - EXACT TEXT
    y = addText(page8, 'Section 18. Amendments.', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;
    text = `This Agreement may only be changed or amended in a writing signed by the parties hereto.`;
    y = addText(page8, text, 50, y, 10, font);
    y -= 30;

    // =========================== SIGNATURE PAGE (9) ===========================
    const signaturePage = pdfDoc.addPage([612, 792]);
    y = 720;
    y = addPageHeader(signaturePage, y);
    y -= 40;

    // CLEAN SIGNATURE PAGE DESIGN
    y = addText(signaturePage, 'SIGNATURES', 250, y, 16, boldFont, 200, primaryColor);
    y -= 60;

    // Create structured signature sections
    const leftColumnX = 60;
    const rightColumnX = 320;

    // Section headers
    y = addText(signaturePage, 'Licensor (Homeowner)', leftColumnX, y, 12, boldFont, 200, primaryColor);
    y = addText(signaturePage, 'Licensee (Housemate)', rightColumnX, y, 12, boldFont, 200, primaryColor);
    y -= 30;

    // Signature lines and labels
    const signatureLineY = y - 10;
    
    // Draw signature lines
    signaturePage.drawLine({
      start: { x: leftColumnX, y: signatureLineY },
      end: { x: leftColumnX + 200, y: signatureLineY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    signaturePage.drawLine({
      start: { x: rightColumnX, y: signatureLineY },
      end: { x: rightColumnX + 200, y: signatureLineY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Add actual signatures with clean styling
    const handwritingFont = await pdfDoc.embedFont(StandardFonts.CourierOblique);
    
    if (formData.hostSignature) {
      signaturePage.drawText(formData.hostSignature, {
        x: leftColumnX + 5,
        y: signatureLineY + 5,
        size: 14,
        font: handwritingFont,
        color: rgb(0, 0, 0.7),
      });
    }

    if (formData.seekerSignature) {
      signaturePage.drawText(formData.seekerSignature, {
        x: rightColumnX + 5,
        y: signatureLineY + 5,
        size: 14,
        font: handwritingFont,
        color: rgb(0, 0, 0.7),
      });
    }

    y = signatureLineY - 15;
    y = addText(signaturePage, 'Signature', leftColumnX, y, 9, font, 200, rgb(0.3, 0.3, 0.3));
    y = addText(signaturePage, 'Signature', rightColumnX, y, 9, font, 200, rgb(0.3, 0.3, 0.3));
    y -= 25;

    // Printed name lines
    const printedNameY = y;
    
    signaturePage.drawLine({
      start: { x: leftColumnX, y: printedNameY },
      end: { x: leftColumnX + 200, y: printedNameY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    signaturePage.drawLine({
      start: { x: rightColumnX, y: printedNameY },
      end: { x: rightColumnX + 200, y: printedNameY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Add printed names
    if (formData.hostName) {
      signaturePage.drawText(formData.hostName, {
        x: leftColumnX + 5,
        y: printedNameY + 5,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      });
    }

    if (formData.seekerName) {
      signaturePage.drawText(formData.seekerName, {
        x: rightColumnX + 5,
        y: printedNameY + 5,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      });
    }

    y = printedNameY - 15;
    y = addText(signaturePage, 'Printed Name', leftColumnX, y, 9, font, 200, rgb(0.3, 0.3, 0.3));
    y = addText(signaturePage, 'Printed Name', rightColumnX, y, 9, font, 200, rgb(0.3, 0.3, 0.3));
    y -= 25;

    // Date lines
    const dateY = y;
    
    signaturePage.drawLine({
      start: { x: leftColumnX, y: dateY },
      end: { x: leftColumnX + 120, y: dateY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    signaturePage.drawLine({
      start: { x: rightColumnX, y: dateY },
      end: { x: rightColumnX + 120, y: dateY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Show signature dates if available
    let hostSignDate = new Date().toLocaleDateString('en-US');
    let seekerSignDate = '';

    if (formData.hostSignedAt) {
      try {
        const signedDate = new Date(formData.hostSignedAt);
        hostSignDate = signedDate.toLocaleDateString('en-US');
      } catch (error) {
        console.warn('Error parsing host signature date:', formData.hostSignedAt);
      }
    }

    if (formData.seekerSignedAt) {
      try {
        const signedDate = new Date(formData.seekerSignedAt);
        seekerSignDate = signedDate.toLocaleDateString('en-US');
      } catch (error) {
        console.warn('Error parsing seeker signature date:', formData.seekerSignedAt);
      }
    }

    // Add dates
    signaturePage.drawText(hostSignDate, {
      x: leftColumnX + 5,
      y: dateY + 5,
      size: 11,
      font: font,
      color: rgb(0, 0, 0),
    });

    if (formData.seekerSignature && seekerSignDate) {
      signaturePage.drawText(seekerSignDate, {
        x: rightColumnX + 5,
        y: dateY + 5,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      });
    }

    y = dateY - 15;
    y = addText(signaturePage, 'Date', leftColumnX, y, 9, font, 200, rgb(0.3, 0.3, 0.3));
    y = addText(signaturePage, 'Date', rightColumnX, y, 9, font, 200, rgb(0.3, 0.3, 0.3));

    // =========================== PROPERTY ADDENDUM PAGES (10-14) ===========================
    // PAGE 10 - Property Addendum Start
    const page10 = pdfDoc.addPage([612, 792]);
    y = 750;
    y = addPageHeader(page10, y);
    y -= 40;

    y = addText(page10, 'Property Addendum', 200, y, 16, boldFont, 300, primaryColor);
    y -= 30;

    y = addText(page10, 'This Property Addendum is attached to and forms part of the Golden HomeShare Limited License Agreement (the "Agreement") dated', 50, y, 10, font);
    text = `${formatDate(formData.moveInDate)} between ${formData.hostName} (Licensor) and ${formData.seekerName} (Licensee) for the property located at ${formData.propertyAddress}.`;
    y = addText(page10, text, 50, y, 10, font);
    y -= 20;

    // Licensee Areas Section
    y = addText(page10, 'LICENSEE AREAS', 50, y, 12, boldFont, 500, primaryColor);
    y -= 15;
    text = `The following areas of the Residence are designated as "Licensee Areas" for non-exclusive shared occupancy by Licensee:`;
    y = addText(page10, text, 50, y, 10, font);
    y -= 10;

    // Enhanced Bedroom Description
    if (formData.bedroomDescription) {
      y = addText(page10, '[X] Bedroom: ' + formData.bedroomDescription, 70, y, 10, font, 450);
      y -= 8;
    }
    
    // Bathroom Access
    if (formData.bathroomType && formData.bathroomDescription) {
      const bathroomTypeLabel = formData.bathroomType === 'private' ? 'Private Bathroom' : 'Shared Bathroom';
      y = addText(page10, '[X] ' + bathroomTypeLabel + ': ' + formData.bathroomDescription, 70, y, 10, font, 450);
      y -= 8;
    }
    
    // Additional Rooms
    if (formData.additionalRooms && formData.additionalRooms.length > 0) {
      formData.additionalRooms.forEach(room => {
        if (room.name && room.description) {
          y = addText(page10, '[X] ' + room.name + ': ' + room.description, 70, y, 10, font, 450);
          y -= 8;
        }
      });
    }
    
    // Legacy fallback for backward compatibility
    if (formData.bedroomAAccess && !formData.bedroomDescription) {
      y = addText(page10, '[X] Bedroom A: ' + (formData.bedroomANotes || 'Private bedroom'), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.bedroomBAccess) {
      y = addText(page10, '[X] Bedroom B: ' + (formData.bedroomBNotes || 'Private bedroom'), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.otherAreasAccess) {
      y = addText(page10, '[X] Other Areas: ' + (formData.otherAreasNotes || 'Additional private areas'), 70, y, 10, font, 450);
      y -= 8;
    }
    
    // Room description if provided (legacy)
    if (formData.roomDescription && !formData.bedroomDescription) {
      y = addText(page10, '[X] Room Description: ' + formData.roomDescription, 70, y, 10, font, 450);
      y -= 8;
    }

    y -= 20;

    // Shared Areas Section
    y = addText(page10, 'SHARED AREAS', 50, y, 12, boldFont, 500, primaryColor);
    y -= 15;
    text = `The following areas of the Residence are designated as "Shared Areas" for common use by both Licensor and Licensee:`;
    y = addText(page10, text, 50, y, 10, font);
    y -= 10;

    // Enhanced Shared Areas with new fields
    if (formData.kitchenAccess) {
      y = addText(page10, '[X] Kitchen' + (formData.kitchenNotes ? ': ' + formData.kitchenNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.laundryAccess) {
      y = addText(page10, '[X] Laundry' + (formData.laundryNotes ? ': ' + formData.laundryNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.livingRoomAccess) {
      y = addText(page10, '[X] Living Room' + (formData.livingRoomNotes ? ': ' + formData.livingRoomNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.diningRoomAccess) {
      y = addText(page10, '[X] Dining Room' + (formData.diningRoomNotes ? ': ' + formData.diningRoomNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.parkingAccess) {
      y = addText(page10, '[X] Parking' + (formData.parkingNotes ? ': ' + formData.parkingNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.indoorStorageAccess) {
      y = addText(page10, '[X] Indoor Storage' + (formData.indoorStorageNotes ? ': ' + formData.indoorStorageNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.outdoorAccess) {
      y = addText(page10, '[X] Outdoor Access' + (formData.outdoorNotes ? ': ' + formData.outdoorNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.additionalSharedAreas) {
      y = addText(page10, '[X] Additional Shared Areas: ' + formData.additionalSharedAreas, 70, y, 10, font, 450);
      y -= 8;
    }
    
    // Legacy fallback for backward compatibility
    if (formData.livingAreaAccess && !formData.livingRoomAccess) {
      y = addText(page10, '[X] Living room/family room' + (formData.livingAreaNotes ? ': ' + formData.livingAreaNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.diningAreaAccess && !formData.diningRoomAccess) {
      y = addText(page10, '[X] Dining area' + (formData.diningAreaNotes ? ': ' + formData.diningAreaNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.laundryAreaAccess && !formData.laundryAccess) {
      y = addText(page10, '[X] Laundry room/facilities' + (formData.laundryAreaNotes ? ': ' + formData.laundryAreaNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.outdoorAreaAccess && !formData.outdoorAccess) {
      y = addText(page10, '[X] Outdoor spaces (yard, patio, deck)' + (formData.outdoorAreaNotes ? ': ' + formData.outdoorAreaNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.outdoorStorageAccess) {
      y = addText(page10, '[X] Outdoor storage' + (formData.outdoorStorageNotes ? ': ' + formData.outdoorStorageNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    if (formData.otherSharedAccess) {
      y = addText(page10, '[X] Other shared areas' + (formData.otherSharedNotes ? ': ' + formData.otherSharedNotes : ''), 70, y, 10, font, 450);
      y -= 8;
    }
    
    // Shared Space Guidelines
    if (formData.sharedSpaceConditions) {
      y -= 10;
      y = addText(page10, 'SHARED SPACE GUIDELINES', 50, y, 12, boldFont, 500, primaryColor);
      y -= 10;
      y = addText(page10, formData.sharedSpaceConditions, 70, y, 10, font, 450);
      y -= 8;
    }

    // Specific Items if provided
    if (formData.specificItemsOwnership) {
      y -= 10;
      y = addText(page10, 'SPECIFIC ITEMS OWNERSHIP', 50, y, 12, boldFont, 500, primaryColor);
      y -= 10;
      y = addText(page10, formData.specificItemsOwnership, 70, y, 10, font, 450);
      y -= 8;
    }

    // =========================== PAGE 11 - HOUSE RULES SECTION ===========================
    const pageRules = pdfDoc.addPage([612, 792]);
    y = 720;
    y = addPageHeader(pageRules, y);
    y -= 30;

    y = addText(pageRules, 'Section 3. House Rules', 50, y, 14, boldFont, 500, primaryColor);
    y -= 20;

    // A. Use of Shared Areas
    y = addText(pageRules, 'A. Use of Shared Areas', 50, y, 12, boldFont, 500, primaryColor);
    y -= 15;

    y = addText(pageRules, '1. We agree to use the TVs in the Shared Areas as follows:', 50, y, 10, boldFont);
    y -= 10;

    // Use actual TV usage data
    const tvUsageText = {
      'anytime': '[X] Turn on anytime at a reasonable volume',
      'ask': '[X] If the other person is in the same room, ask to turn on TV',
      'limited': '[X] TV limited to these days or hours: ' + (formData.tvLimitedHours || 'See specified times'),
      'offlimits': '[X] TV off-limits'
    };
    
    y = addText(pageRules, tvUsageText[formData.tvUsage as keyof typeof tvUsageText] || tvUsageText['anytime'], 70, y, 10, font);
    y -= 8;

    if (formData.tvUsage === 'limited' && formData.tvLimitedHours) {
      y = addText(pageRules, '    Hours: ' + formData.tvLimitedHours, 70, y, 10, font);
      y -= 8;
    }
    y -= 10;

    y = addText(pageRules, '2. We agree to play music in the Shared Areas as follows:', 50, y, 10, boldFont);
    y -= 10;

    // Use actual music usage data
    const musicUsageText = {
      'anytime': '[X] Play at any time at a reasonable volume',
      'ask': '[X] If the other person is in the same room, ask to play music',
      'limited': '[X] Playing music limited to these days or hours: ' + (formData.musicLimitedHours || 'See specified times'),
      'offlimits': '[X] Playing music off-limits'
    };

    y = addText(pageRules, musicUsageText[formData.musicUsage as keyof typeof musicUsageText] || musicUsageText['anytime'], 70, y, 10, font);
    y -= 8;

    if (formData.musicUsage === 'limited' && formData.musicLimitedHours) {
      y = addText(pageRules, '    Hours: ' + formData.musicLimitedHours, 70, y, 10, font);
      y -= 8;
    }
    y -= 15;

    // B. Social and Leisure Time
    y = addText(pageRules, 'B. Social and Leisure Time', 50, y, 12, boldFont, 500, primaryColor);
    y -= 15;

    y = addText(pageRules, 'We agree that the following activities are acceptable:', 50, y, 10, font);
    y -= 10;

    // Use actual social activities data
    if (formData.alcoholAllowed) {
      y = addText(pageRules, '[X] Drinking alcohol', 70, y, 10, font);
      y -= 8;
      if (formData.alcoholParameters) {
        y = addText(pageRules, '    Within these parameters: ' + formData.alcoholParameters, 70, y, 10, font);
        y -= 8;
      }
    } else {
      y = addText(pageRules, '[ ] Drinking alcohol - Not permitted', 70, y, 10, font);
      y -= 8;
    }

    if (formData.smokingAllowed) {
      y = addText(pageRules, '[X] Smoking', 70, y, 10, font);
      y -= 8;
      if (formData.smokingParameters) {
        y = addText(pageRules, '    Within these parameters: ' + formData.smokingParameters, 70, y, 10, font);
        y -= 8;
      }
    } else {
      y = addText(pageRules, '[ ] Smoking - Not permitted', 70, y, 10, font);
      y -= 8;
    }

    if (formData.otherActivitiesAllowed && formData.otherActivitiesParameters) {
      y = addText(pageRules, '[X] Other: ' + formData.otherActivitiesParameters, 70, y, 10, font);
      y -= 8;
    }
    y -= 15;

    // C. Quiet Hours
    y = addText(pageRules, 'C. Quiet Hours', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;

    // Use actual quiet hours data
    const quietHoursText = `We agree that quiet hours will be from ${formData.quietHoursFrom || '22:00'} to ${formData.quietHoursTo || '07:00'} on ${formData.quietHoursDays || 'Daily'}`;
    y = addText(pageRules, quietHoursText, 50, y, 10, font);
    y -= 15;

    // D. Pets
    y = addText(pageRules, 'D. Pets', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;

    // Use actual pet policy data
    if (formData.petsAllowed) {
      y = addText(pageRules, '[X] Pets ARE permitted at the Residence', 70, y, 10, font);
      y -= 8;
      if (formData.petSpeciesRestrictions) {
        y = addText(pageRules, 'Species and/or breed restrictions: ' + formData.petSpeciesRestrictions, 70, y, 10, font);
        y -= 8;
      }
      if (formData.petOtherParameters) {
        y = addText(pageRules, 'Other parameters: ' + formData.petOtherParameters, 70, y, 10, font);
        y -= 8;
      }
    } else {
      y = addText(pageRules, '[X] Pets ARE NOT permitted at the Residence', 70, y, 10, font);
      y -= 8;
    }

    // =========================== PAGE 11 - HOUSE RULES CONTINUED ===========================
    const page11 = pdfDoc.addPage([612, 792]);
    y = 750;
    y = addPageHeader(page11, y);
    y -= 40;

    // E. Guests
    y = addText(page11, 'E. Guests', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;

    // Use actual guest policy data
    if (formData.guestsAllowed) {
      y = addText(page11, '[X] Guests ARE permitted at the Residence', 70, y, 10, font);
      y -= 8;
      if (formData.guestDaysOccasions) {
        y = addText(page11, 'On the following days and/or occasions: ' + formData.guestDaysOccasions, 70, y, 10, font);
        y -= 8;
      }
      if (formData.guestOtherParameters) {
        y = addText(page11, 'Other parameters: ' + formData.guestOtherParameters, 70, y, 10, font);
        y -= 8;
      }
    } else {
      y = addText(page11, '[X] Guests ARE NOT permitted at the Residence', 70, y, 10, font);
      y -= 8;
    }
    y -= 15;

    // F. Communication
    y = addText(page11, 'F. Communication', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;

    text = 'If/when we need to notify the other party, and if/when we have disagreements, we agree to communicate using:';
    y = addText(page11, text, 50, y, 10, font);
    y -= 15;

    // Use actual communication preferences
    y = addText(page11, 'Notices:', 70, y, 10, boldFont);
    y -= 10;

    if (formData.noticesInPerson) {
      y = addText(page11, '[X] In-person Conversation', 70, y, 10, font);
      y -= 8;
    }
    if (formData.noticesPhone) {
      y = addText(page11, '[X] Phone Call', 70, y, 10, font);
      y -= 8;
    }
    if (formData.noticesText) {
      y = addText(page11, '[X] Text message', 70, y, 10, font);
      y -= 8;
    }
    if (formData.noticesEmail) {
      y = addText(page11, '[X] Email', 70, y, 10, font);
      y -= 8;
    }
    if (formData.noticesOther && formData.noticesOtherMethod) {
      y = addText(page11, '[X] Other: ' + formData.noticesOtherMethod, 70, y, 10, font);
      y -= 8;
    }
    y -= 10;

    y = addText(page11, 'Disagreements:', 70, y, 10, boldFont);
    y -= 10;

    if (formData.disagreementsInPerson) {
      y = addText(page11, '[X] In-person Conversation', 70, y, 10, font);
      y -= 8;
    }
    if (formData.disagreementsPhone) {
      y = addText(page11, '[X] Phone Call', 70, y, 10, font);
      y -= 8;
    }
    if (formData.disagreementsText) {
      y = addText(page11, '[X] Text message', 70, y, 10, font);
      y -= 8;
    }
    if (formData.disagreementsEmail) {
      y = addText(page11, '[X] Email', 70, y, 10, font);
      y -= 8;
    }
    if (formData.disagreementsOther && formData.disagreementsOtherMethod) {
      y = addText(page11, '[X] Other: ' + formData.disagreementsOtherMethod, 70, y, 10, font);
      y -= 8;
    }
    y -= 15;

    // G. Chores
    y = addText(page11, 'G. Chores', 50, y, 12, boldFont, 500, primaryColor);
    y -= 10;

    y = addText(page11, 'Licensor and Licensee agree on the following chore ownership and timing:', 50, y, 10, font);
    y -= 15;

    // Use actual chores data
    if (formData.choresList && formData.choresList.length > 0) {
      y = addText(page11, 'Task', 70, y, 10, boldFont);
      y = addText(page11, 'Chore Owner', 250, y, 10, boldFont);
      y = addText(page11, 'Frequency', 400, y, 10, boldFont);
      y -= 10;

      formData.choresList.forEach(chore => {
        if (chore.task || chore.owner || chore.frequency) {
          y = addText(page11, chore.task || '', 70, y, 10, font);
          y = addText(page11, chore.owner || '', 250, y, 10, font);
          y = addText(page11, chore.frequency || '', 400, y, 10, font);
          y -= 8;
        }
      });
    } else {
      y = addText(page11, 'No specific chores assigned.', 70, y, 10, font);
      y -= 8;
    }
    y -= 10;

    // Use actual dish policy data
    y = addText(page11, '1. Dishes should be washed:', 50, y, 10, boldFont);
    y -= 10;

    const dishPolicyText = {
      'rightaway': '[X] Right away—no sitting in the sink',
      'overnight': '[X] Overnight is fine',
      'nopreference': '[X] Longer than overnight is fine/no preference'
    };

    y = addText(page11, dishPolicyText[formData.dishesPolicy as keyof typeof dishPolicyText] || dishPolicyText['rightaway'], 70, y, 10, font);
    y -= 8;

    // =========================== PAGE 12 - HOUSE RULES FINAL SECTION ===========================
    const page12 = pdfDoc.addPage([612, 792]);
    y = 750;
    y = addPageHeader(page12, y);
    y -= 40;

    // Use actual expired food policy data
    y = addText(page12, '2. Expired food should be thrown out:', 50, y, 10, boldFont);
    y -= 10;

    const foodPolicyText = {
      'rightaway': '[X] Right away—no sitting in the fridge/pantry',
      'fewdays': '[X] Within a few days is fine',
      'nopreference': '[X] Longer than a few days is fine/no preference'
    };

    y = addText(page12, foodPolicyText[formData.expiredFoodPolicy as keyof typeof foodPolicyText] || foodPolicyText['rightaway'], 70, y, 10, font);
    y -= 8;
    y -= 15;

    // I. Support Services Requested
    if (formData.supportRequested && formData.supportRequested.length > 0) {
      y = addText(page12, 'I. Support Services Requested', 50, y, 12, boldFont, 500, primaryColor);
      y -= 10;

      y = addText(page12, 'As part of this homesharing arrangement, the Licensor (homeowner) would appreciate assistance with the following services:', 50, y, 10, font);
      y -= 15;

      const supportLabels: Record<string, string> = {
        cleaning: "Cleaning",
        cooking: "Cooking", 
        gardening: "Yard Work",
        errands: "Shopping & Errands",
        companionship: "Companionship",
        petCare: "Pet Care",
        techSupport: "Tech Support",
        homeMaintenance: "Home Maintenance",
        transportation: "Transportation"
      };

      // Professional table layout with better spacing
      const tableStartX = 80;
      const hoursColumnX = 350; // Better centered position for hours column
      
      y = addText(page12, 'Service', tableStartX, y, 10, boldFont);
      y = addText(page12, 'Hours per Week', hoursColumnX, y, 10, boldFont);
      y -= 18;

      // Professional table header underline
      page12.drawLine({
        start: { x: tableStartX, y: y + 8 },
        end: { x: 500, y: y + 8 },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
      });
      y -= 8;

      // List each support service with professional spacing
      formData.supportRequested.forEach(support => {
        const supportLabel = supportLabels[support.id] || support.id;
        y = addText(page12, supportLabel, tableStartX, y, 10, font);
        y = addText(page12, `${support.hoursPerWeek} ${support.hoursPerWeek === 1 ? 'hour' : 'hours'}`, hoursColumnX, y, 10, font);
        y -= 14; // Better row spacing
      });

      y -= 10;
      y = addText(page12, 'NOTE: These support services are mutual agreements and should be discussed between both parties. The specific terms, timing, and expectations for these services should be clearly established and detailed as needed.', 50, y, 9, font, 500);
      y -= 20;
    }

    // Check if we need a new page for Section J (custom section)
    if (y < 200) { // If less than 200 units from bottom, start new page
      const page13 = pdfDoc.addPage([612, 792]);
      y = 750;
      y = addPageHeader(page13, y);
      y -= 40;

      // H. Custom Section (renumbered to J if support services are present)
      const customSectionLetter = (formData.supportRequested && formData.supportRequested.length > 0) ? 'J' : 'H';
      y = addText(page13, `${customSectionLetter}. Custom Section`, 50, y, 12, boldFont, 500, primaryColor);
      y -= 10;

      y = addText(page13, 'We agree upon the following:', 50, y, 10, font);
      y -= 15;

      // Use actual custom agreements data
      if (formData.customAgreements) {
        y = addText(page13, formData.customAgreements, 50, y, 10, font, 500);
      } else {
        y = addText(page13, 'No additional custom agreements specified.', 50, y, 10, font);
      }
      y -= 25;

      // Additional Information
      if (formData.specialConditions) {
        y = addText(page13, 'SPECIAL CONDITIONS', 50, y, 12, boldFont, 500, primaryColor);
        y -= 10;
        y = addText(page13, formData.specialConditions, 50, y, 10, font, 500);
        y -= 20;
      }

      if (formData.additionalNotes) {
        y = addText(page13, 'ADDITIONAL NOTES', 50, y, 12, boldFont, 500, primaryColor);
        y -= 10;
        y = addText(page13, formData.additionalNotes, 50, y, 10, font, 500);
      }
    } else {
      // H. Custom Section (renumbered to J if support services are present)
      const customSectionLetter = (formData.supportRequested && formData.supportRequested.length > 0) ? 'J' : 'H';
      y = addText(page12, `${customSectionLetter}. Custom Section`, 50, y, 12, boldFont, 500, primaryColor);
      y -= 10;

      y = addText(page12, 'We agree upon the following:', 50, y, 10, font);
      y -= 15;

      // Use actual custom agreements data
      if (formData.customAgreements) {
        y = addText(page12, formData.customAgreements, 50, y, 10, font, 500);
      } else {
        y = addText(page12, 'No additional custom agreements specified.', 50, y, 10, font);
      }
      y -= 25;

      // Additional Information
      if (formData.specialConditions) {
        y = addText(page12, 'SPECIAL CONDITIONS', 50, y, 12, boldFont, 500, primaryColor);
        y -= 10;
        y = addText(page12, formData.specialConditions, 50, y, 10, font, 500);
        y -= 20;
      }

      if (formData.additionalNotes) {
        y = addText(page12, 'ADDITIONAL NOTES', 50, y, 12, boldFont, 500, primaryColor);
        y -= 10;
        y = addText(page12, formData.additionalNotes, 50, y, 10, font, 500);
      }
    }

    // Generate PDF
    const pdfBytes = await pdfDoc.save();

    // Safe filename generation
    const hostNameSafe = (formData.hostName || 'host').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const seekerNameSafe = (formData.seekerName || 'seeker').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="styled-golden-homeshare-agreement-${hostNameSafe}-${seekerNameSafe}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Error generating styled agreement:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace available');
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 });
  }
} 