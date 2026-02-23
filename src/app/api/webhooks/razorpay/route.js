import crypto from 'crypto';
import { NextResponse } from 'next/server';
import Order from '@/models/order';
import Member from '@/models/member';
import { connectDB } from '@/lib/mongodb';
import PaymentOrder from '@/models/paymentOrder';
import Donate from '@/models/donate';

export async function POST(req) {
    await connectDB();

    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

    if (signature !== expectedSignature) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    if (event === 'payment.captured') {
        const payment = payload.payload.payment.entity;
        const notes = payment.notes || {};

        if (notes?.page === "becomeMember") {
            const order = await Order.findOne(
                { orderId: payment.order_id },
            );

            if (!order) {
                return NextResponse.json({ message: 'Order not found' }, { status: 200 });
            }

            const alreadyProcessed = await Member.findOne({
                "transactions.transactionId": payment.id
            });

            if (alreadyProcessed) {
                return NextResponse.json({ status: true }, { status: 200 });
            }

            const lastMember = await Member.findOne().sort({ createdAt: -1 });

            const lastIdNumber = lastMember?.memberId
                ? parseInt(lastMember?.memberId, 10)
                : 0;

            const memberId = String(lastIdNumber + 1).padStart(5, "0");

            await Member.create({
                memberId: memberId,
                fullName: order.fullName,
                email: order.email,
                phone: order.phone,
                password: order.password,
                address: order.address,
                isMember: order.isMember,
                alreadyMember: order.alreadyMember,
                joinReason: order.joinReason,
                documentType: order.documentType,
                documentNumber: order.documentNumber,
                document: order.document,
                facePicture: order.facePicture,
                faceVideo: order.faceVideo,
                memberDocument: order.memberDocument,
                transactions: [{
                    transactionId: payment.id,
                    amount: "100",
                    description: 'Membership Joining Fee',
                    date: new Date()
                }],
                status: 'pending'
            });

            console.log('Member created');
            return NextResponse.json({ status: true });
        };

        if (notes?.page === "membershipRenew") {
            const paymentOrder = await PaymentOrder.findOne({
                orderId: payment.order_id
            });

            if (!paymentOrder) {
                return NextResponse.json({ message: 'Order not found' }, { status: 200 });
            };

            const alreadyProcessed = await Member.findOne({
                _id: paymentOrder.memberId,
                "transactions.transactionId": payment.id
            });

            if (alreadyProcessed) {
                return NextResponse.json({ status: true }, { status: 200 });
            }

            const member = await Member.findById(paymentOrder?.memberId);

            let description;
            let memberShipStartDate;
            let memberShipExpiry;
            let yearlySubscriptionStart;
            let yearlySubscriptionExpiry;

            if (new Date(member?.yearlySubscriptionExpiry) < new Date() && new Date(member?.memberShipExpiry) < new Date()) {
                memberShipStartDate = new Date();
                memberShipExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                yearlySubscriptionStart = new Date();
                yearlySubscriptionExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
                description = 'Monthly Contribution and Yearly Membership Renewal';
            } else if (new Date(member?.yearlySubscriptionExpiry) < new Date()) {
                yearlySubscriptionStart = new Date();
                yearlySubscriptionExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
                description = 'Yearly Subscription Renewal';
            } else if (new Date(member?.memberShipExpiry) < new Date()) {
                memberShipStartDate = new Date();
                memberShipExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                description = 'Monthly Contribution';
            }


            await Member.findByIdAndUpdate(paymentOrder?.memberId, {
                $push: {
                    transactions: {
                        transactionId: payment?.id,
                        amount: paymentOrder?.amount,
                        description: description,
                        date: new Date()
                    },
                },
                status: 'active',
                memberShipStartDate: memberShipStartDate ? memberShipStartDate : member?.memberShipStartDate,
                memberShipExpiry: memberShipExpiry ? memberShipExpiry : member?.memberShipExpiry,
                yearlySubscriptionStart: yearlySubscriptionStart ? yearlySubscriptionStart : member?.yearlySubscriptionStart,
                yearlySubscriptionExpiry: yearlySubscriptionExpiry ? yearlySubscriptionExpiry : member?.yearlySubscriptionExpiry
            });

            paymentOrder.status = 'paid';
            await paymentOrder.save();


            console.log('Member updated');
            return NextResponse.json({ status: true });
        };

        if (notes?.page === "donation") {
            const donate = await Donate.findOne({
                orderId: payment.order_id
            });

            if (!donate) {
                return NextResponse.json({ message: 'Order not found' }, { status: 200 });
            };

            donate.status = 'success';
            donate.transactionId = payment.id;
            await donate.save();

            if (!donate?.donateAnonymously) {
                const member = await Member.findOneAndUpdate(
                    {
                        $or: [
                            { email: donate.email },
                            { phone: donate.phone },
                        ],
                    },
                    {
                        $push: {
                            transactions: {
                                transactionId: payment?.id,
                                amount: donate?.amount,
                                description: "Donation",
                                date: new Date(),
                            },
                        },
                    },
                    {
                        new: true,
                    }
                );
            }

            return NextResponse.json({ status: true });
        }
    };

    if (event === 'payment.failed') {
        // await Order.findOneAndDelete({ orderId: payload.payload.payment.entity.order_id });
        console.log('Payment failed ordre deleted');
        return NextResponse.json({ status: true });
    };
}