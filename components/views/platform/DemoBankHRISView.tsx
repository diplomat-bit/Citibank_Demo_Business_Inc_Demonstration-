// components/views/platform/DemoBankHRISView.tsx
import React, { useState, useMemo } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

// NOTE: In a real app, this data would come from dedicated files e.g., /data/platform/hrisData.ts and /types/platform/employee.ts
interface Employee { id: string; name: string; department: string; role: string; }
const MOCK_EMPLOYEES: Employee[] = [
    { id: 'emp-001', name: 'Alex Chen', department: 'Engineering', role: 'Lead Frontend Engineer' },
    { id: 'emp-002', name: 'Brenda Rodriguez', department: 'Sales', role: 'Account Executive' },
    { id: 'emp-003', name: 'Charles Davis', department: 'Marketing', role: 'Content Strategist' },
];

const DemoBankHRISView: React.FC = () => {
    const [isWriterOpen, setWriterOpen] = useState(false);
    const [jobTitle, setJobTitle] = useState("Senior Frontend Engineer");
    const [generatedJD, setGeneratedJD] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedJD('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Write a professional job description for a "${jobTitle}" position. Include sections for Responsibilities, Qualifications, and Benefits.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setGeneratedJD(response.text);
        } catch (error) {
            setGeneratedJD("Error: Could not generate job description.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank HRIS</h2>
                    <button onClick={() => setWriterOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Job Description Writer</button>
                </div>
                <Card title="Employee Directory">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                             <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr><th>Name</th><th>Department</th><th>Role</th></tr>
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
            {isWriterOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setWriterOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Job Description Writer</h3></div>
                        <div className="p-6 space-y-4">
                            <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Enter a job title..." className="w-full bg-gray-700/50 p-2 rounded text-white" />
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Draft Description'}</button>
                            <Card title="Generated Description"><div className="min-h-[15rem] max-h-80 overflow-y-auto text-sm text-gray-300 whitespace-pre-line">{isLoading ? 'Generating...' : generatedJD}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default DemoBankHRISView;