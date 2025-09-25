import React from 'react';
import Card from '../../Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { engagementData, followerData, recentPosts } from '../../../data/platform/socialData';

const DemoBankSocialView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Social</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">1.2M</p><p className="text-sm text-gray-400 mt-1">Total Followers</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">2.5%</p><p className="text-sm text-gray-400 mt-1">Engagement Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">25.6k</p><p className="text-sm text-gray-400 mt-1">Impressions (24h)</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">+1.2k</p><p className="text-sm text-gray-400 mt-1">New Followers (7d)</p></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Follower Growth">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={followerData}>
                            <defs><linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                            <Area type="monotone" dataKey="followers" stroke="#8884d8" fill="url(#colorFollowers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Weekly Engagement">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={engagementData}>
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                            <Legend />
                            <Bar dataKey="engagement" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            
            <Card title="Recent Posts">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Platform</th>
                                <th scope="col" className="px-6 py-3">Content</th>
                                <th scope="col" className="px-6 py-3">Likes</th>
                                <th scope="col" className="px-6 py-3">Shares</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPosts.map(post => (
                                <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-bold text-white">{post.platform}</td>
                                    <td className="px-6 py-4">{post.content}</td>
                                    <td className="px-6 py-4">{post.likes.toLocaleString()}</td>
                                    <td className="px-6 py-4">{post.shares.toLocaleString()}</td>
                                    <td className="px-6 py-4">{post.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default DemoBankSocialView;
