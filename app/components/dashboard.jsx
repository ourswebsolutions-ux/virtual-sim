'use client'

import React, { useState, useMemo } from 'react';
import { Search, X, Calendar, ChevronDown, LogOut, ExternalLink, Check, Clock, AlertCircle, Download } from 'lucide-react';

// Mock data generator
const generateTransactions = () => {
  const statuses = ['completed', 'pending', 'failed'];
  const currencies = ['PKR', 'INR', 'BDT', 'PHP'];
  
  return Array.from({ length: 24 }, (_, i) => {
    const usdAmount = Math.floor(Math.random() * 900) + 100;
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const exchangeRate = currency === 'PKR' ? 278 : currency === 'INR' ? 83 : currency === 'BDT' ? 110 : 56;
    const localAmount = (usdAmount * exchangeRate).toFixed(2);
    
    return {
      id: `TXN${String(1000 + i).padStart(6, '0')}`,
      date: new Date(2026, 0, Math.floor(Math.random() * 28) + 1).toISOString(),
      sentAmount: usdAmount,
      receivedAmount: localAmount,
      currency,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      recipient: `recipient_${i}@example.com`,
      fee: (usdAmount * 0.015).toFixed(2),
      exchangeRate
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    failed: 'bg-red-50 text-red-700 border-red-200'
  };
  
  const icons = {
    completed: <Check className="w-3 h-3" />,
    pending: <Clock className="w-3 h-3" />,
    failed: <AlertCircle className="w-3 h-3" />
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      <span className="capitalize">{status}</span>
    </span>
  );
};

// Stat Card Component
const StatCard = ({ label, value, subValue, trend }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5">
    <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
    <div className="text-2xl font-semibold text-gray-900 mb-1">{value}</div>
    {subValue && <div className="text-sm text-gray-500">{subValue}</div>}
  </div>
);

// Transaction Modal Component
const TransactionModal = ({ transaction, onClose }) => {
  if (!transaction) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
            <p className="text-sm text-gray-500 mt-0.5">{transaction.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <StatusBadge status={transaction.status} />
          </div>
          
          {/* Amount Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount Sent</span>
              <span className="text-sm font-medium text-gray-900">${transaction.sentAmount.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Exchange Rate</span>
              <span className="text-sm font-medium text-gray-900">1 USD = {transaction.exchangeRate} {transaction.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Transaction Fee</span>
              <span className="text-sm font-medium text-gray-900">${transaction.fee} USD</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Amount Received</span>
              <span className="text-sm font-semibold text-gray-900">{transaction.receivedAmount} {transaction.currency}</span>
            </div>
          </div>
          
          {/* Transaction Info */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(transaction.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Recipient</span>
              <span className="text-sm font-medium text-gray-900">{transaction.recipient}</span>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex gap-3">
          <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 inline mr-2" />
            Download Receipt
          </button>
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-16 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Clock className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
      Start sending money internationally to see your transaction history here.
    </p>
    <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
      Make Your First Payment
    </button>
  </div>
);

// Main Dashboard Component
export default function Dashboard() {
  const [transactions] = useState(generateTransactions());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           txn.recipient.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const completed = transactions.filter(t => t.status === 'completed');
    return {
      totalTransactions: transactions.length,
      totalSent: completed.reduce((sum, t) => sum + t.sentAmount, 0).toFixed(2),
      completedCount: completed.length
    };
  }, [transactions]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-0.5">Welcome back, Sarah Chen</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard 
            label="Total Transactions" 
            value={stats.totalTransactions}
            subValue={`${stats.completedCount} completed`}
          />
          <StatCard 
            label="Total Sent" 
            value={`$${stats.totalSent}`}
            subValue="USD"
          />
          <StatCard 
            label="Success Rate" 
            value={`${Math.round((stats.completedCount / stats.totalTransactions) * 100)}%`}
            subValue="Last 30 days"
          />
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction ID or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Transaction Table/List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg">
            <EmptyState />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Sent (USD)</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Received</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((txn) => (
                      <tr 
                        key={txn.id} 
                        onClick={() => setSelectedTransaction(txn)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{txn.id}</div>
                          <div className="text-xs text-gray-500">{txn.recipient}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          ${txn.sentAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <div className="font-medium text-gray-900">{txn.receivedAmount}</div>
                          <div className="text-xs text-gray-500">{txn.currency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={txn.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Mobile Card List */}
            <div className="lg:hidden space-y-3">
              {filteredTransactions.map((txn) => (
                <div 
                  key={txn.id} 
                  onClick={() => setSelectedTransaction(txn)}
                  className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">{txn.id}</div>
                      <div className="text-xs text-gray-500">{txn.recipient}</div>
                    </div>
                    <StatusBadge status={txn.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Sent</div>
                      <div className="text-sm font-medium text-gray-900">${txn.sentAmount.toFixed(2)} USD</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Received</div>
                      <div className="text-sm font-medium text-gray-900">{txn.receivedAmount} {txn.currency}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-3">
                    {new Date(txn.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>© 2026 PaymentPlatform. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                Support <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                Privacy Policy <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                Terms <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Transaction Modal */}
      {selectedTransaction && (
        <TransactionModal 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
        />
      )}
    </div>
  );
}