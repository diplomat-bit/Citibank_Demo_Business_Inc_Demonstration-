// components/views/platform/DemoBankHRISView.tsx
import React, { useContext, useMemo } from 'react';
import Card from '../../Card';
import { DataContext } from '../../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_EMPLOYEES } from '../../../data/platform/hrisData';

const DemoBankHRISView: React.FC = () => {

    const kpiData = useMemo(() => ({
        totalEmployees: MOCK_EMPLOYEES.length,
        avgTenure: '3.2 years',
        turnoverRate: '8.5%',
    }), [MOCK_EMPLOYEES]);
    
    const departmentData = useMemo(() => {
        const counts = MOCK_EMPLOYEES.reduce((acc, emp) => {
            acc[emp.department] = (acc[emp.department] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [MOCK_EMPLOYEES]);

    const COLORS = ['#06b6d4', '#6366f1', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank HRIS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.totalEmployees}</p><p className="text-sm text-gray-400 mt-1">Total Employees</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.avgTenure}</p><p className="text-sm text-gray-400 mt-1">Average Tenure</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.turnoverRate}</p><p className="text-sm text-gray-400 mt-1">Annual Turnover</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">5</p><p className="text-sm text-gray-400 mt-1">Open Positions</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Headcount by Department">
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {departmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Employee Directory">
                    <div className="overflow-x-auto h-[300px]">
                        <table className="w-full text-sm text-left text-gray-400">
                             <thead className="text-xs text-gray-300 uppercase bg-gray-900/30 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Department</th>
                                    <th className="px-6 py-3">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_EMPLOYEES.map(emp => (
                                    <tr key={emp.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{emp.name}</td>
                                        <td className="px-6 py-4">{emp.department}</td>
                                        <td className="px-6 py-4">{emp.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DemoBankHRISView;