// components/views/personal/SecurityView.tsx
import React, { useContext, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import PlaidLinkButton from '../../PlaidLinkButton';

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SecurityView must be within a DataProvider.");
    
    const { linkedAccounts, unlinkAccount, handlePlaidSuccess } = context;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Security & Access</h2>
            
            <Card title="Linked Accounts & Data Sources">
                <div className="space-y-3 mb-6">
                    {linkedAccounts.map(account => (
                        <div key={account.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                            <div><h4 className="font-semibold text-white">{account.name}</h4><p className="text-sm text-gray-400">Account ending in ****{account.mask}</p></div>
                            <button onClick={() => unlinkAccount(account.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs">Unlink</button>
                        </div>
                    ))}
                </div>
                <PlaidLinkButton onSuccess={handlePlaidSuccess} />
            </Card>

            <Card title="Security Settings">
                 <ul className="divide-y divide-gray-700/60">
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Two-Factor Authentication (2FA)</h4><p className="text-sm text-gray-400">Add an extra layer of security to your account.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Biometric Login</h4><p className="text-sm text-gray-400">Use your face or fingerprint to log in.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" />
                    </li>
                     <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Change Password</h4><p className="text-sm text-gray-400">Update your account password.</p></div>
                        <button className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs">Change</button>
                    </li>
                </ul>
            </Card>

            <Card title="Recent Login Activity">
                 <p className="text-gray-400 text-sm">This section would show a log of recent logins, including device, location, and time to help you monitor for suspicious activity.</p>
            </Card>
        </div>
    );
};

export default SecurityView;
