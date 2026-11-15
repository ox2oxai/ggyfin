'use client';

import React, { useState, useEffect } from 'react';
import { UserRole, UserSession } from '@nbfc/shared';
import { getStaffDirectorySync } from '../../../lib/staff';
import {
  Mail,
  Send,
  Inbox,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Search,
  Plus,
  X,
  Reply,
  ShieldAlert,
  Building2,
  FileCheck,
  Tag
} from 'lucide-react';

interface StaffMessage {
  id: string;
  sender: string;
  senderRole: UserRole;
  senderName: string;
  recipient: string;
  recipientName: string;
  subject: string;
  body: string;
  timestamp: string;
  category: 'KYC_CLARIFICATION' | 'CASH_VERIFICATION' | 'URGENT_AUDIT' | 'BRANCH_NOTICE';
  isRead: boolean;
  referenceId?: string;
}

const INITIAL_MESSAGES: StaffMessage[] = [];

export default function StaffMailboxPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<StaffMessage[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'urgent' | 'sent'>('all');
  const [selectedMessage, setSelectedMessage] = useState<StaffMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffDirectory, setStaffDirectory] = useState<Array<{ username: string; fullName: string; role: string }>>([]);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [recipient, setRecipient] = useState('all_staff');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'KYC_CLARIFICATION' | 'CASH_VERIFICATION' | 'URGENT_AUDIT' | 'BRANCH_NOTICE'>('KYC_CLARIFICATION');
  const [referenceId, setReferenceId] = useState('');
  const [body, setBody] = useState('');
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    setMounted(true);
    const rawSession = localStorage.getItem('nbfc_staff_session');
    if (rawSession) {
      try {
        setSession(JSON.parse(rawSession));
      } catch (e) {
        // fallback
      }
    } else {
      window.location.href = '/login';
      return;
    }

    const dir = getStaffDirectorySync();
    setStaffDirectory(dir);

    const rawMsgs = localStorage.getItem('nbfc_staff_messages');
    if (rawMsgs) {
      try {
        const parsed = JSON.parse(rawMsgs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setSelectedMessage(parsed[0]);
        }
      } catch (e) {
        // fallback
      }
    }
  }, []);

  const currentUsername = session?.username || 'Staff User';

  const updateMessagesAndSync = (newMessages: StaffMessage[]) => {
    setMessages(newMessages);
    try {
      localStorage.setItem('nbfc_staff_messages', JSON.stringify(newMessages));
      window.dispatchEvent(new Event('nbfc_messages_updated'));
    } catch (e) {
      // ignore
    }
  };

  const markAsRead = (msgId: string) => {
    const updated = messages.map((m) => (m.id === msgId ? { ...m, isRead: true } : m));
    updateMessagesAndSync(updated);
    if (selectedMessage && selectedMessage.id === msgId) {
      setSelectedMessage({ ...selectedMessage, isRead: true });
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.referenceId && msg.referenceId.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return !msg.isRead;
    if (activeFilter === 'urgent') return msg.category === 'URGENT_AUDIT' || msg.category === 'KYC_CLARIFICATION';
    if (activeFilter === 'sent') return msg.sender === currentUsername;
    return true;
  });

  const handleFilterChange = (filter: 'all' | 'unread' | 'urgent' | 'sent') => {
    setActiveFilter(filter);
    const newFiltered = messages.filter((msg) => {
      if (filter === 'unread') return !msg.isRead;
      if (filter === 'urgent') return msg.category === 'URGENT_AUDIT' || msg.category === 'KYC_CLARIFICATION';
      if (filter === 'sent') return msg.sender === currentUsername;
      return true;
    });

    if (newFiltered.length > 0) {
      // Keep selected if still in filtered list, else select first
      if (selectedMessage && newFiltered.some((m) => m.id === selectedMessage.id)) {
        // keep current
      } else {
        setSelectedMessage(newFiltered[0]);
      }
    } else {
      setSelectedMessage(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    const targetStaff = staffDirectory.find((s) => s.username === recipient);
    const resolvedRecipientName =
      recipient === 'all_staff'
        ? 'All Branch Staff'
        : targetStaff
        ? `${targetStaff.fullName} (${targetStaff.role})`
        : recipient;

    const newMsgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newMsg: StaffMessage = {
      id: newMsgId,
      sender: currentUsername,
      senderRole: session?.role || UserRole.FIELD_OFFICER,
      senderName: `${currentUsername} (${session?.role || 'Staff'})`,
      recipient,
      recipientName: resolvedRecipientName,
      subject,
      body,
      timestamp: 'Just now',
      category,
      isRead: true,
      referenceId: referenceId.trim() || undefined
    };

    const updated = [newMsg, ...messages];
    updateMessagesAndSync(updated);
    setSelectedMessage(newMsg);
    setIsComposeOpen(false);
    setSubject('');
    setBody('');
    setReferenceId('');
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;

    // Edge case fix: If replying to a message authored by current user (in Sent folder),
    // send to the original recipient, NOT to oneself!
    const isAuthoredByMe = selectedMessage.sender === currentUsername;
    const replyRecipient = isAuthoredByMe ? selectedMessage.recipient : selectedMessage.sender;
    const replyRecipientName = isAuthoredByMe ? selectedMessage.recipientName : selectedMessage.senderName;

    const replyMsgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const replyMsg: StaffMessage = {
      id: replyMsgId,
      sender: currentUsername,
      senderRole: session?.role || UserRole.FIELD_OFFICER,
      senderName: `${currentUsername} (${session?.role || 'Staff'})`,
      recipient: replyRecipient,
      recipientName: replyRecipientName,
      subject: selectedMessage.subject.startsWith('RE:') ? selectedMessage.subject : `RE: ${selectedMessage.subject}`,
      body: replyText,
      timestamp: 'Just now',
      category: selectedMessage.category,
      isRead: true,
      referenceId: selectedMessage.referenceId
    };

    const updated = [replyMsg, ...messages];
    updateMessagesAndSync(updated);
    setSelectedMessage(replyMsg);
    setReplyText('');
  };

  const getCategoryBadge = (cat: StaffMessage['category']) => {
    switch (cat) {
      case 'URGENT_AUDIT':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Urgent Audit</span>;
      case 'KYC_CLARIFICATION':
        return <span className="bg-saffron-100 text-saffron-800 border border-saffron-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">KYC Query</span>;
      case 'CASH_VERIFICATION':
        return <span className="bg-bankGreen-100 text-bankGreen-800 border border-bankGreen-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Cash Vault</span>;
      case 'BRANCH_NOTICE':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Notice</span>;
      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-3xl border border-clay p-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-96 bg-white rounded-3xl border border-clay"></div>
          <div className="lg:col-span-7 h-96 bg-white rounded-3xl border border-clay"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-clay shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-bankGreen-800 bg-bankGreen-100 px-3 py-1 rounded-full mb-2">
            <Mail className="w-3.5 h-3.5 text-bankGreen-700" />
            <span>Dual-Control Inter-Staff Communication</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-forest-900 tracking-tight">
            Bank Staff Secure Mailbox
          </h2>
          <p className="text-xs text-forest-800/80 mt-0.5">
            Audit-logged messaging for KYC clarifications, vault dual-custody verification, and loan approvals.
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Compose New Message</span>
        </button>
      </div>

      {/* Main Mailbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Folders & Message List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navigation Filter Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-clay flex items-center justify-between text-xs font-bold">
            <button
              onClick={() => handleFilterChange('all')}
              className={`flex-1 py-1.5 text-center rounded-xl transition-all ${
                activeFilter === 'all' ? 'bg-forest-900 text-white' : 'text-forest-800 hover:bg-pearl-100'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => handleFilterChange('unread')}
              className={`flex-1 py-1.5 text-center rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeFilter === 'unread' ? 'bg-forest-900 text-white' : 'text-forest-800 hover:bg-pearl-100'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full">{unreadCount}</span>
              )}
            </button>
            <button
              onClick={() => handleFilterChange('urgent')}
              className={`flex-1 py-1.5 text-center rounded-xl transition-all ${
                activeFilter === 'urgent' ? 'bg-forest-900 text-white' : 'text-forest-800 hover:bg-pearl-100'
              }`}
            >
              Urgent
            </button>
            <button
              onClick={() => handleFilterChange('sent')}
              className={`flex-1 py-1.5 text-center rounded-xl transition-all ${
                activeFilter === 'sent' ? 'bg-forest-900 text-white' : 'text-forest-800 hover:bg-pearl-100'
              }`}
            >
              Sent
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-forest-800/40 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by subject, sender, or Loan APP / Account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-clay rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-saffron-500 text-forest-900 placeholder-forest-800/40"
            />
          </div>

          {/* Message List */}
          <div className="bg-white rounded-3xl border border-clay divide-y divide-clay/40 overflow-hidden shadow-xs max-h-[600px] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-forest-800/60">
                <Inbox className="w-8 h-8 text-forest-800/30 mx-auto mb-2" />
                No messages found matching your criteria.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      markAsRead(msg.id);
                    }}
                    className={`p-4 cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? 'bg-saffron-50/70 border-l-4 border-l-saffron-500'
                        : !msg.isRead
                        ? 'bg-pearl-100 hover:bg-pearl-200'
                        : 'hover:bg-pearl-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        {!msg.isRead && (
                          <span className="w-2 h-2 rounded-full bg-saffron-600 shrink-0" />
                        )}
                        <span className={`font-bold text-forest-900 truncate max-w-[180px] ${!msg.isRead ? 'font-black' : ''}`}>
                          {msg.senderName.split('(')[0]}
                        </span>
                      </div>
                      <span className="text-[10px] text-forest-800/60 shrink-0">{msg.timestamp}</span>
                    </div>

                    <p className={`text-xs text-forest-900 truncate ${!msg.isRead ? 'font-extrabold' : 'font-semibold'}`}>
                      {msg.subject}
                    </p>

                    <p className="text-[11px] text-forest-800/70 line-clamp-2 mt-1">
                      {msg.body}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      {getCategoryBadge(msg.category)}
                      {msg.referenceId && (
                        <span className="text-[10px] font-mono font-bold text-forest-800 bg-sandstone-200 px-1.5 py-0.5 rounded">
                          {msg.referenceId}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Detail & Reply View */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="bg-white rounded-3xl border border-clay shadow-xs overflow-hidden flex flex-col h-full">
              {/* Message Header */}
              <div className="p-6 border-b border-clay bg-pearl-50">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(selectedMessage.category)}
                    {selectedMessage.referenceId && (
                      <span className="text-xs font-mono font-bold text-forest-900 bg-sandstone-200 px-2 py-0.5 rounded border border-sandstone-300">
                        Ref: {selectedMessage.referenceId}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-forest-800/70 font-semibold">{selectedMessage.timestamp}</span>
                </div>

                <h3 className="text-lg font-black text-forest-900 tracking-tight">
                  {selectedMessage.subject}
                </h3>

                <div className="mt-4 pt-3 border-t border-clay/60 flex flex-col sm:flex-row justify-between text-xs gap-2">
                  <div>
                    <span className="text-forest-800/60">From: </span>
                    <strong className="text-forest-900">{selectedMessage.senderName}</strong>
                  </div>
                  <div>
                    <span className="text-forest-800/60">To: </span>
                    <strong className="text-forest-900">{selectedMessage.recipientName}</strong>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-6 text-xs text-forest-900 leading-relaxed font-normal whitespace-pre-wrap min-h-[160px] bg-white">
                {selectedMessage.body}
              </div>

              {/* Quick Reply Box */}
              <div className="p-4 sm:p-6 border-t border-clay bg-pearl-100 mt-auto">
                <p className="text-xs font-bold text-forest-900 mb-2 flex items-center gap-1.5">
                  <Reply className="w-3.5 h-3.5 text-saffron-600" />
                  <span>
                    Send Immediate Response to{' '}
                    {selectedMessage.sender === currentUsername
                      ? selectedMessage.recipientName.split('(')[0]
                      : selectedMessage.senderName.split('(')[0]}
                  </span>
                </p>

                <div className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Type your response or confirmation..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 bg-white border border-clay rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-saffron-500 text-forest-900 placeholder-forest-800/40"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="inline-flex items-center gap-2 bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all"
                    >
                      <Send className="w-3.5 h-3.5 text-saffron-400" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-clay p-12 text-center text-forest-800/60">
              <Mail className="w-12 h-12 text-forest-800/30 mx-auto mb-3" />
              <p className="text-sm font-bold">Select a message from the left to read details</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Message Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-clay shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-clay bg-pearl-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-saffron-600" />
                <h3 className="font-extrabold text-sm text-forest-900">Compose Bank Staff Message</h3>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="text-forest-800 hover:text-forest-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-forest-900 mb-1">Recipient Staff Member</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-2.5 bg-white border border-clay rounded-xl text-xs font-semibold text-forest-900 focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="all_staff">📢 Broadcast: All Branch Staff</option>
                  {staffDirectory.map((staff) => (
                    <option key={staff.username} value={staff.username}>
                      {staff.fullName} ({staff.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Message Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-clay rounded-xl text-xs font-semibold text-forest-900 focus:ring-2 focus:ring-saffron-500"
                  >
                    <option value="KYC_CLARIFICATION">KYC Clarification</option>
                    <option value="CASH_VERIFICATION">Cash Vault Verification</option>
                    <option value="URGENT_AUDIT">Urgent Audit Notice</option>
                    <option value="BRANCH_NOTICE">General Branch Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Reference ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. APP-703-902 or RCPT-..."
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-clay rounded-xl text-xs text-forest-900 focus:ring-2 focus:ring-saffron-500 placeholder-forest-800/40 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of query or notice..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-white border border-clay rounded-xl text-xs text-forest-900 focus:ring-2 focus:ring-saffron-500 placeholder-forest-800/40"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your operational query, 4-eyes confirmation, or vault memo..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3 bg-white border border-clay rounded-2xl text-xs text-forest-900 focus:ring-2 focus:ring-saffron-500 placeholder-forest-800/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-clay">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 border border-clay text-forest-800 rounded-xl font-bold hover:bg-pearl-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl font-bold transition-all shadow-xs"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
