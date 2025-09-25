// components/views/platform/DemoBankLMSView.tsx
import React from 'react';
import Card from '../../Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MOCK_COURSES } from '../../../data/platform/lmsData';

const DemoBankLMSView: React.FC = () => {
    
    const kpiData = {
        totalCourses: MOCK_COURSES.length,
        totalEnrollments: MOCK_COURSES.reduce((sum, course) => sum + course.enrollment, 0),
        avgCompletion: MOCK_COURSES.reduce((sum, course) => sum + course.completionRate, 0) / MOCK_COURSES.length,
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank LMS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.totalCourses}</p><p className="text-sm text-gray-400 mt-1">Total Courses</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.totalEnrollments.toLocaleString()}</p><p className="text-sm text-gray-400 mt-1">Total Enrollments</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.avgCompletion.toFixed(1)}%</p><p className="text-sm text-gray-400 mt-1">Avg. Completion</p></Card>
            </div>
            
            <Card title="Course Enrollment vs. Completion Rate">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={MOCK_COURSES}>
                        <XAxis dataKey="title" stroke="#9ca3af" fontSize={10} interval={0} />
                        <YAxis yAxisId="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="enrollment" fill="#8884d8" name="Enrollment" />
                        <Bar yAxisId="right" dataKey="completionRate" fill="#82ca9d" name="Completion (%)" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Course Catalog">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th className="px-6 py-3">Course Title</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Enrollments</th>
                                <th className="px-6 py-3">Completion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_COURSES.map(course => (
                                <tr key={course.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{course.title}</td>
                                    <td className="px-6 py-4">{course.category}</td>
                                    <td className="px-6 py-4">{course.enrollment.toLocaleString()}</td>
                                    <td className="px-6 py-4">{course.completionRate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default DemoBankLMSView;
