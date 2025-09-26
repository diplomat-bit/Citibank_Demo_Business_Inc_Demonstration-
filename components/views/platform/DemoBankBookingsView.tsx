// components/views/platform/DemoBankBookingsView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankBookingsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Bookings</h2>
            <Card title="Overview">
                <p className="text-gray-400">A comprehensive scheduling and appointment management platform. Integrate calendars, manage services, and automate client communications.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Services Catalog"><p>Define and manage bookable services with custom durations and pricing.</p></Card>
                 <Card title="Team Calendars"><p>Sync team availability and manage schedules across the organization.</p></Card>
                 <Card title="Automated Reminders"><p>Reduce no-shows with automated email and SMS reminders for clients.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankBookingsView;