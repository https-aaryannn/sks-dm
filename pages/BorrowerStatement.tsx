import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBorrower } from '../services/firestoreService';
import { Borrower } from '../types';
import { Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const BorrowerStatement: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [borrower, setBorrower] = useState<Borrower | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBorrower = async () => {
            if (!id) return;
            try {
                const data = await getBorrower(id);
                if (data) {
                    setBorrower(data);
                } else {
                    setError('Borrower not found.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load statement.');
            } finally {
                setLoading(false);
            }
        };
        fetchBorrower();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400">Loading statement...</p>
                </div>
            </div>
        );
    }

    if (error || !borrower) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4">
                <div className="text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Error</h1>
                    <p className="text-slate-400">{error || 'Statement not found.'}</p>
                </div>
            </div>
        );
    }

    const percentage = Math.min(100, (borrower.repaidAmount / borrower.totalPayable) * 100);
    const remaining = borrower.totalPayable - borrower.repaidAmount;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Card */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                {borrower.name}
                            </h1>
                            <div className="flex items-center text-slate-400 mt-2">
                                <Phone size={16} className="mr-2" />
                                {borrower.phone}
                            </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${borrower.status === 'Completed'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                            {borrower.status === 'Completed' ? 'Loan Repaid' : 'Active Loan'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Loan Amount</p>
                            <p className="text-xl font-bold text-white mt-1">₹{borrower.loanAmount}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Repaid</p>
                            <p className="text-xl font-bold text-green-400 mt-1">₹{borrower.repaidAmount}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Outstanding</p>
                            <p className="text-xl font-bold text-amber-400 mt-1">₹{remaining}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Start Date</p>
                            <p className="text-lg font-medium text-slate-200 mt-1">{new Date(borrower.startDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Repayment Progress</span>
                            <span className="text-slate-200 font-medium">{Math.round(percentage)}%</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Clock size={20} className="text-slate-400" />
                        Payment History
                    </h2>

                    {borrower.history.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-white/5 border-dashed">
                            <p className="text-slate-500">No payments recorded yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl shadow-lg">
                            <table className="w-full text-left">
                                <thead className="bg-black/20 text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[...borrower.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment) => (
                                        <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-slate-300">
                                                {new Date(payment.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    {new Date(payment.date).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-green-400">
                                                +₹{payment.amount}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <CheckCircle size={12} />
                                                    Received
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="text-center text-xs text-slate-600 pt-8 pb-4">
                    Generated by SKS Money Lending Services
                </div>
            </div>
        </div>
    );
};

export default BorrowerStatement;
