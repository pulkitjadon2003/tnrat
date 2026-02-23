"use client";

import { useRouter } from "next/navigation";


export default function JoinMission() {
    const router = useRouter();

    const handleJoinClick = () => {
        router.push("/become-member");
    };

    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <div className="bg-green-600 rounded-2xl p-12 max-w-2xl w-full">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Join Our Mission
                            </h2>
                            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                                Be part of our community and help us serve humanity.
                            </p>
                            <button
                                onClick={handleJoinClick}
                                className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition duration-300 cursor-pointer"
                            >
                                Become a Member
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}