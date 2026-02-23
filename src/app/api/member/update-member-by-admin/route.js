// app/api/member/update-member/route.js
import { NextResponse } from 'next/server';
import Member from '@/models/member';
import { connectDB } from '@/lib/mongodb';
import path from "path";
import fs from "fs/promises";

const IMAGE_DIR = "/var/www/tnrat-media/images";
const MEDIA_BASE_URL = process.env.MEDIA_BASE_URL;

const getFileNameFromUrl = (url) => {
    if (!url) return null;

    try {
        const u = new URL(url);
        return path.basename(u.pathname); // abc.jpg / abc.mp4
    } catch (err) {
        return url.split("/").pop();
    }
};

const safeDeleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log("Deleted file:", filePath);
    } catch (err) {
        if (err.code !== "ENOENT") {
            console.error("File delete error:", err);
        }
    }
};

const saveFileToServer = async (file, folderPath) => {
    if (!file || file.size === 0) return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(folderPath, fileName);

    await fs.writeFile(filePath, buffer);

    return `${MEDIA_BASE_URL}/uploads/${fileName}`;
};

export async function PUT(request) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { status: false, message: 'Member ID is required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        const formData = await request.formData();

        // Extract form fields
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const address = formData.get('address');
        const joinReason = formData.get('joinReason');
        const documentType = formData.get('documentType');
        const documentNumber = formData.get('documentNumber');
        const status = formData.get('status');
        const memberShipStartDate = formData.get('memberShipStartDate');
        const memberShipExpiry = formData.get('memberShipExpiry');
        const yearlySubscriptionStart = formData.get('yearlySubscriptionStart');
        const yearlySubscriptionExpiry = formData.get('yearlySubscriptionExpiry');
        const alreadyMember = formData.get('alreadyMember') === 'true';

        // Extract files
        const documentFile = formData.get('document');
        const facePictureFile = formData.get('facePicture');
        // const faceVideoFile = formData.get('faceVideo');
        // const memberDocumentFile = formData.get('memberDocument');

        // Extract existing file URLs
        const existingDocument = formData.get('existingDocument');
        const existingFacePicture = formData.get('existingFacePicture');
        // const existingFaceVideo = formData.get('existingFaceVideo');
        // const existingMemberDocument = formData.get('existingMemberDocument');


        // Find existing member
        const existingMember = await Member.findById(id);
        if (!existingMember) {
            return NextResponse.json(
                { status: false, message: 'Member not found' },
                { status: 404 }
            );
        }

        // Check if email is already taken by another member
        const emailExists = await Member.findOne({
            email: email,
            _id: { $ne: id }
        });
        if (emailExists) {
            return NextResponse.json(
                { status: false, message: 'Email is already registered' },
                { status: 400 }
            );
        }

        // Check if phone is already taken by another member
        const phoneExists = await Member.findOne({
            phone: phone,
            _id: { $ne: id }
        });
        if (phoneExists) {
            return NextResponse.json(
                { status: false, message: 'Phone number is already registered' },
                { status: 400 }
            );
        }

        const updateData = {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            address: address?.trim() || '',
            joinReason: joinReason?.trim() || '',
            documentType: documentType.trim(),
            documentNumber: documentNumber.trim(),
            status: status || 'pending',
            alreadyMember: alreadyMember,
            memberShipStartDate: memberShipStartDate ? new Date(memberShipStartDate) : null,
            memberShipExpiry: memberShipExpiry ? new Date(memberShipExpiry) : null,
            yearlySubscriptionStart: yearlySubscriptionStart ? new Date(yearlySubscriptionStart) : null,
            yearlySubscriptionExpiry: yearlySubscriptionExpiry ? new Date(yearlySubscriptionExpiry) : null,
        };

        // Handle document upload/update
        if (documentFile && documentFile.size > 0) {
            if (existingMember?.document) {
                const oldDocumentName = getFileNameFromUrl(existingMember?.document);
                if (oldDocumentName) {
                    await safeDeleteFile(path.join(IMAGE_DIR, oldDocumentName));
                }
                // await deleteFromCloudinaryByUrl(existingMember.document);
            }

            // Upload new document
            const documentUpload = await saveFileToServer(documentFile, IMAGE_DIR);

            updateData.document = documentUpload;
            updateData.documentVerified = false; // Reset verification when document changes

        } else if (existingDocument && existingDocument !== 'null') {
            // Keep existing document
            updateData.document = existingMember.document;
        } else {
            // No document provided and no existing document - remove document
            if (existingMember.document) {
                const oldDocumentName = getFileNameFromUrl(existingMember?.document);
                if (oldDocumentName) {
                    await safeDeleteFile(path.join(IMAGE_DIR, oldDocumentName));
                }
                // await deleteFromCloudinaryByUrl(existingMember.document, 'image');
            }
            updateData.document = '';
        }

        // Handle face picture upload/update
        if (facePictureFile && facePictureFile.size > 0) {
            try {
                // Delete old face picture if exists
                if (existingMember?.facePicture) {
                    const oldDocumentName = getFileNameFromUrl(existingMember?.facePicture);
                    if (oldDocumentName) {
                        await safeDeleteFile(path.join(IMAGE_DIR, oldDocumentName));
                    }
                    // await deleteFromCloudinaryByUrl(existingMember.facePicture, 'image');
                }

                // Upload new face picture
                // const facePictureBuffer = Buffer.from(await facePictureFile.arrayBuffer());
                // const facePictureUpload = await uploadToCloudinary(
                //     { buffer: facePictureBuffer, type: facePictureFile.type },
                //     'members/photos'
                // );

                const facePictureUpload = await saveFileToServer(facePictureFile, IMAGE_DIR);

                updateData.facePicture = facePictureUpload;
            } catch (facePictureError) {
                console.error('Face picture upload failed:', facePictureError);
                return NextResponse.json(
                    { status: false, message: 'Face picture upload failed: ' + facePictureError.message },
                    { status: 400 }
                );
            }
        } else if (existingFacePicture && existingFacePicture !== 'null') {
            // Keep existing face picture
            updateData.facePicture = existingMember.facePicture;
        } else {
            // No face picture provided and no existing face picture - remove face picture
            if (existingMember.facePicture) {
                const oldDocumentName = getFileNameFromUrl(existingMember?.facePicture);
                if (oldDocumentName) {
                    await safeDeleteFile(path.join(IMAGE_DIR, oldDocumentName));
                }
                // await deleteFromCloudinaryByUrl(existingMember.facePicture, 'image');
            }
            updateData.facePicture = '';
        }

        // Handle face video upload/update
        // if (faceVideoFile && faceVideoFile.size > 0) {
        //     try {
        //         // Delete old face video if exists
        //         if (existingMember?.faceVideo) {
        //             await deleteFromCloudinaryByUrl(existingMember.faceVideo, 'video');
        //         }

        //         // Upload new face video
        //         const faceVideoBuffer = Buffer.from(await faceVideoFile.arrayBuffer());
        //         const faceVideoUpload = await uploadToCloudinary(
        //             {
        //                 buffer: faceVideoBuffer,
        //                 type: faceVideoFile.type,
        //                 resourceType: 'video'
        //             },
        //             'members/videos'
        //         );
        //         updateData.faceVideo = faceVideoUpload;
        //     } catch (faceVideoError) {
        //         console.error('Face video upload failed:', faceVideoError);
        //         return NextResponse.json(
        //             { status: false, message: 'Face video upload failed: ' + faceVideoError.message },
        //             { status: 400 }
        //         );
        //     }
        // } else if (existingFaceVideo && existingFaceVideo !== 'null') {
        //     // Keep existing face video
        //     updateData.faceVideo = existingMember.faceVideo;
        // } else {
        //     // No face video provided and no existing face video - remove face video
        //     if (existingMember.faceVideo) {
        //         await deleteFromCloudinaryByUrl(existingMember.faceVideo, 'video');
        //     }
        //     updateData.faceVideo = '';
        // }

        // // Handle member document upload/update
        // if (memberDocumentFile && memberDocumentFile.size > 0) {
        //     try {
        //         // Delete old member document if exists
        //         if (existingMember?.memberDocument) {
        //             await deleteFromCloudinaryByUrl(existingMember.memberDocument, 'image');
        //         }

        //         // Upload new member document
        //         const memberDocumentBuffer = Buffer.from(await memberDocumentFile.arrayBuffer());
        //         const memberDocumentUpload = await uploadToCloudinary(
        //             {
        //                 buffer: memberDocumentBuffer,
        //                 type: memberDocumentFile.type,
        //                 resourceType: memberDocumentFile.type.includes('pdf') ? 'raw' : 'image'
        //             },
        //             'members/documents'
        //         );
        //         updateData.memberDocument = memberDocumentUpload;
        //     } catch (memberDocumentError) {
        //         console.error('Member document upload failed:', memberDocumentError);
        //         return NextResponse.json(
        //             { status: false, message: 'Member document upload failed: ' + memberDocumentError.message },
        //             { status: 400 }
        //         );
        //     }
        // } else if (existingMemberDocument && existingMemberDocument !== 'null') {
        //     // Keep existing member document
        //     updateData.memberDocument = existingMember.memberDocument;
        // } else {
        //     // No member document provided and no existing member document - remove member document
        //     if (existingMember.memberDocument) {
        //         await deleteFromCloudinaryByUrl(existingMember.memberDocument, 'image');
        //     }
        //     updateData.memberDocument = '';
        // }

        // Update member in database
        const updatedMember = await Member.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from response

        return NextResponse.json(
            {
                status: true,
                message: 'Member updated successfully',
                member: updatedMember
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update member error:', error);
        return NextResponse.json(
            { status: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}