import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const body = await request.json();
        const { memberId, fullName, joinDate, email, phone, address } = body;

        // Create PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]);

        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

        const centerX = width / 2;

        // ----- Load and Embed Logo -----
        let logoImage;
        let signOneImage;
        let signTwoImage;
        let sealOneImage;
        let sealTwoImage;
        let sealThreeImage;
        let sealFourImage;
        try {
            const logoPath = path.join(process.cwd(), 'public', 'tnrat-logo.png');
            const logoBytes = fs.readFileSync(logoPath);
            logoImage = await pdfDoc.embedPng(logoBytes);
        } catch (logoError) {
            console.log('Logo not found, proceeding without logo');
        }

        try {
            const sealPath = path.join(process.cwd(), 'public', 'sealone.png');
            const sealBytes = fs.readFileSync(sealPath);
            sealOneImage = await pdfDoc.embedPng(sealBytes);


            const sealTwoPath = path.join(process.cwd(), 'public', 'sealtwo.png');
            const sealTwoBytes = fs.readFileSync(sealTwoPath);
            sealTwoImage = await pdfDoc.embedPng(sealTwoBytes);


            const sealThreePath = path.join(process.cwd(), 'public', 'sealthree.png');
            const sealThreeBytes = fs.readFileSync(sealThreePath);
            sealThreeImage = await pdfDoc.embedPng(sealThreeBytes);


            const sealFourPath = path.join(process.cwd(), 'public', 'sealfour.png');
            const sealFourBytes = fs.readFileSync(sealFourPath);
            sealFourImage = await pdfDoc.embedPng(sealFourBytes);


            const signPath = path.join(process.cwd(), 'public', 'signone.png');
            const signBytes = fs.readFileSync(signPath);
            signOneImage = await pdfDoc.embedPng(signBytes);


            const signTwoPath = path.join(process.cwd(), 'public', 'signtwo.png');
            const signTwoBytes = fs.readFileSync(signTwoPath);
            signTwoImage = await pdfDoc.embedPng(signTwoBytes);
        } catch (logoError) {
            console.log('seal error', logoError)
            console.log('seal not found, proceeding without seal');
        }
        // Decorative border with gradient effect
        page.drawRectangle({
            x: 20,
            y: 20,
            width: width - 40,
            height: height - 40,
            borderWidth: 3,
            borderColor: rgb(0.8, 0.9, 0.85),
            color: rgb(0.98, 0.98, 0.97),
        });

        if (logoImage) {
            // Draw logo on left side
            const logoDims = logoImage.scale(0.15);
            page.drawImage(logoImage, {
                x: 80,
                y: height - 90,
                width: logoDims.width / 2,
                height: logoDims.height / 2,
            });
        }

        const headerWidth = logoImage ? 300 : 360;
        const headerX = logoImage ? 140 : 180;

        page.drawText("Tahaffuz-e-Namoos-e-Risalat Action Trust (TNRAT)", {
            x: headerX,
            y: height - 70,
            size: 14,
            font: bold,
            color: rgb(0.1, 0.4, 0.2),
        });

        page.drawText("To Protect the Namoos-e-Risalat and serving the community with Islamic values ", {
            x: headerX,
            y: height - 85,
            size: 12,
            font: italic,
            color: rgb(0.1, 0.4, 0.2),
        });

        page.drawText("CERTIFICATE OF MEMBERSHIP", {
            x: centerX - 150,
            y: height - 145,
            size: 18,
            font: bold,
            color: rgb(0.1, 0.4, 0.2),
        });

        // Decorative line under title
        page.drawLine({
            start: { x: centerX - 155, y: height - 150 },
            end: { x: centerX + 130, y: height - 150 },
            thickness: 2,
            color: rgb(0.8, 0.9, 0.85),
        });


        const certificateText = [
            "THIS IS TO CERTIFY THAT " + fullName.toUpperCase() + " has been duly registered as a",
            "bonafide member of the Tahaffuz-e-Namoos-e-Risalat Action Trust (TNRAT) and is entitled",
            "to all privileges, benefits, and rights accorded to members of this association.",
            "We extend our warmest welcome and look forward to their active participation in our",
            " community activities."
        ];

        certificateText.forEach((line, index) => {
            const yPos = height - 220 - (index * 25);

            page.drawText(line, {
                x: 40,
                y: yPos,
                font: font,
                size: 12,
                // font: isName ? bold : (index === 0 ? bold : font),
                // color: isName ? rgb(0.1, 0.5, 0.2) : rgb(0.2, 0.2, 0.2),
                maxWidth: 600,
            });
        });

        // ----- Membership Details Box -----
        const detailsBoxY = height - 370;

        // Box background
        page.drawRectangle({
            x: 50,
            y: detailsBoxY - 200,
            width: width - 100,
            height: 200,
            color: rgb(0.95, 0.97, 0.94),
            borderWidth: 1,
            borderColor: rgb(0.8, 0.9, 0.85),
        });

        // Box title
        page.drawText("MEMBERSHIP INFORMATION", {
            x: centerX - 100,
            y: detailsBoxY - 30,
            size: 14,
            font: bold,
            color: rgb(0.2, 0.5, 0.3),
        });

        // Details in two columns
        const leftColX = 80;
        let currentY = detailsBoxY - 60;

        const details = [
            ["Membership ID", memberId],
            ["Full Name", fullName],
            ["Join Date", new Date(joinDate).toLocaleDateString("en-IN")],
            ["Email", email],
            ["Phone", phone]
        ];

        details.forEach(([label, value]) => {
            page.drawText(`${label}:`, {
                x: leftColX,
                y: currentY,
                font: bold,
                size: 10,
                color: rgb(0.3, 0.3, 0.3),
            });

            page.drawText(String(value), {
                x: leftColX + 120,
                y: currentY,
                font,
                size: 10,
                color: rgb(0.1, 0.1, 0.1),
                maxWidth: 200,
            });

            currentY -= 25;
        });

        // Address in full width
        page.drawText("Address:", {
            x: leftColX,
            y: currentY,
            font: bold,
            size: 10,
            color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(address, {
            x: leftColX + 120,
            y: currentY,
            font,
            size: 10,
            color: rgb(0.1, 0.1, 0.1),
            maxWidth: 380,
        });

        // ----- Footer Section -----
        const footerY = 120;


        // Signatures section
        const signatureY = footerY;

        // President signature

        if (sealOneImage) {
            // Draw logo on left side
            const sealDims = sealOneImage.scale(0.15);
            page.drawImage(sealOneImage, {
                x: 110,
                y: signatureY + 2,
                width: sealDims.width / 2,
                height: sealDims.height / 2,
            });
        }

        if (signOneImage) {
            // Draw logo on left side
            const sealDims = signOneImage.scale(0.15);
            page.drawImage(signOneImage, {
                x: 160,
                y: signatureY,
                width: sealDims.width / 2,
                height: sealDims.height / 2,
            });
        }


        page.drawLine({
            start: { x: 100, y: signatureY },
            end: { x: 250, y: signatureY },
            thickness: 1,
            color: rgb(0.3, 0.3, 0.3),
        });


        if (sealThreeImage) {
            const sealDims = sealThreeImage.scale(0.15);
            page.drawImage(sealThreeImage, {
                x: 120,
                y: signatureY - 40,
                width: sealDims.width / 2,
                height: sealDims.height / 2,
            });
        }

        if (sealTwoImage) {
            const sealDims = sealTwoImage.scale(0.15);
            page.drawImage(sealTwoImage, {
                x: 350,
                y: signatureY + 2,
                width: sealDims.width / 2,
                height: sealDims.height / 2,
            });
        }

        if (signTwoImage) {
            // Draw logo on left side
            const sealDims = signTwoImage.scale(0.15);
            page.drawImage(signTwoImage, {
                x: 405,
                y: signatureY,
                width: sealDims.width / 2,
                height: sealDims.height / 2,
            });
        }


        // Secretary signature
        page.drawLine({
            start: { x: width - 250, y: signatureY },
            end: { x: width - 100, y: signatureY },
            thickness: 1,
            color: rgb(0.3, 0.3, 0.3),
        });


        if (sealFourImage) {
            const sealDims = sealFourImage.scale(0.15);
            page.drawImage(sealFourImage, {
                x: 360,
                y: signatureY - 30,
                width: sealDims.width / 2,
                height: sealDims.height / 2,
            });
        }

        page.drawText("Head Office: Malihabad, Lucknow, Uttar Pradesh", {
            x: 60, 
            y: 40,
            font: bold,
            size: 20,
            color: rgb(0.2, 0.5, 0.3),
        });



        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=TNRAT-Membership-Certificate-${memberId}.pdf`
            },
        });

    } catch (e) {
        console.log("Error:", e);
        return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
    }
}