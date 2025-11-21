// src/pages/ApplicationStatusPage.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

// Giả lập data (Sẽ thay bằng API thật)
const FAKE_DATA = {
    position: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    date: "November 5, 2024",
    status: "Under Review",
    resume: "John_Doe_Resume_2024.pdf"
};

export default function ApplicationStatusPage() {
    const { id: jobId } = useParams();
    const data = FAKE_DATA; // Dùng data giả

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                
                {/* Thông báo chính */}
                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                    <div>
                        <h2 className="font-semibold text-blue-800">Already Applied</h2>
                        <p className="text-sm text-blue-700">You have already applied for this position.</p>
                    </div>
                </div>

                {/* Chi tiết đơn */}
                <div className="mt-6 border-t pt-6">
                    <div className="mb-4">
                        <div className="text-sm text-gray-500">POSITION</div>
                        <div className="text-lg font-semibold">{data.position}</div>
                        <div className="text-gray-600">{data.company}</div>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm text-gray-500">APPLICATION DATE</div>
                        <div className="font-semibold">{data.date}</div>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm text-gray-500">APPLICATION STATUS</div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">{data.status}</span>
                        <p className="text-sm text-gray-600 mt-2">Our team is reviewing your application. We'll notify you once we make a decision.</p>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm text-gray-500">RESUME SUBMITTED</div>
                        <div className="font-semibold text-blue-600">{data.resume}</div>
                    </div>
                </div>

                {/* Ghi chú */}
                <div className="bg-gray-50 p-4 rounded-lg mt-6 text-sm text-gray-700">
                    <p><b>Can't apply again:</b> You can only submit one application per position. If you'd like to update your application, please contact our support team.</p>
                </div>

                {/* Nút Quay lại */}
                <div className="text-center mt-8">
                    <Link
                        to={`/jobs/${jobId}`}
                        className="px-6 py-3 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Job Details
                    </Link>
                </div>
            </div>
        </div>
    );
}