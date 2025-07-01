
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Send, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Transfer {
  id: string;
  recipient_name: string;
  recipient_email: string;
  bank_name: string;
  account_number: string;
  amount: number;
  status: string;
  reference: string;
  created_at: string;
  failure_reason?: string;
}

interface Recipient {
  id: string;
  recipient_code: string;
  name: string;
  email: string;
  bank_name: string;
  account_number: string;
  is_active: boolean;
}

interface Bank {
  name: string;
  code: string;
}

interface TransferPanelProps {
  onBack: () => void;
}

const TransferPanel = ({ onBack }: TransferPanelProps) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRecipient, setShowNewRecipient] = useState(false);
  const [showNewTransfer, setShowNewTransfer] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // New recipient form state
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    bank_code: '',
    account_number: ''
  });

  // New transfer form state
  const [newTransfer, setNewTransfer] = useState({
    recipient_code: '',
    amount: '',
    reason: ''
  });

  useEffect(() => {
    fetchData();
    fetchBanks();
  }, []);

  const fetchData = async () => {
    try {
      const [transfersRes, recipientsRes] = await Promise.all([
        supabase.from('transfers').select('*').order('created_at', { ascending: false }),
        supabase.from('transfer_recipients').select('*').eq('is_active', true).order('name')
      ]);

      if (transfersRes.error) throw transfersRes.error;
      if (recipientsRes.error) throw recipientsRes.error;

      setTransfers(transfersRes.data || []);
      setRecipients(recipientsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transfer data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await fetch('https://api.paystack.co/bank', {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_'}`
        }
      });
      const data = await response.json();
      if (data.status) {
        setBanks(data.data);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const createRecipient = async () => {
    if (!newRecipient.name || !newRecipient.email || !newRecipient.bank_code || !newRecipient.account_number) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('paystack-create-recipient', {
        body: newRecipient,
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipient created successfully.",
      });

      setNewRecipient({ name: '', email: '', bank_code: '', account_number: '' });
      setShowNewRecipient(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create recipient.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const initiateTransfer = async () => {
    if (!newTransfer.recipient_code || !newTransfer.amount) {
      toast({
        title: "Error",
        description: "Please select a recipient and enter an amount.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('paystack-initiate-transfer', {
        body: {
          recipient_code: newTransfer.recipient_code,
          amount: parseFloat(newTransfer.amount),
          reason: newTransfer.reason
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transfer initiated successfully.",
      });

      setNewTransfer({ recipient_code: '', amount: '', reason: '' });
      setShowNewTransfer(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate transfer.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section className="py-8 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto text-center py-16">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading transfer data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Panel
          </Button>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Transfer Management</h1>
          <p className="text-lg text-slate-600">Manage Paystack transfers and recipients</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recipients ({recipients.length})
                <Button
                  size="sm"
                  onClick={() => setShowNewRecipient(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Recipient
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recipients.length === 0 ? (
                <p className="text-slate-500">No recipients found</p>
              ) : (
                <div className="space-y-2">
                  {recipients.slice(0, 5).map((recipient) => (
                    <div key={recipient.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">{recipient.name}</div>
                        <div className="text-sm text-slate-500">{recipient.bank_name} - {recipient.account_number}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Transfers
                <Button
                  size="sm"
                  onClick={() => setShowNewTransfer(true)}
                  disabled={recipients.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-1" />
                  New Transfer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transfers.length === 0 ? (
                <p className="text-slate-500">No transfers found</p>
              ) : (
                <div className="space-y-2">
                  {transfers.slice(0, 5).map((transfer) => (
                    <div key={transfer.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">₦{transfer.amount.toLocaleString()}</div>
                        <div className="text-sm text-slate-500">{transfer.recipient_name}</div>
                      </div>
                      <Badge className={getStatusColor(transfer.status)}>
                        {transfer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* New Recipient Modal */}
        {showNewRecipient && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Recipient</CardTitle>
              <CardDescription>Create a new transfer recipient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newRecipient.name}
                    onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newRecipient.email}
                    onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label htmlFor="bank">Bank</Label>
                  <Select value={newRecipient.bank_code} onValueChange={(value) => setNewRecipient(prev => ({ ...prev, bank_code: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.code} value={bank.code}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="account">Account Number</Label>
                  <Input
                    id="account"
                    value={newRecipient.account_number}
                    onChange={(e) => setNewRecipient(prev => ({ ...prev, account_number: e.target.value }))}
                    placeholder="Enter account number"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={createRecipient} disabled={processing}>
                  {processing ? 'Creating...' : 'Create Recipient'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewRecipient(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Transfer Modal */}
        {showNewTransfer && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Initiate Transfer</CardTitle>
              <CardDescription>Send money to a registered recipient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select value={newTransfer.recipient_code} onValueChange={(value) => setNewTransfer(prev => ({ ...prev, recipient_code: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipients.map((recipient) => (
                        <SelectItem key={recipient.id} value={recipient.recipient_code}>
                          {recipient.name} - {recipient.bank_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTransfer.amount}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Input
                    id="reason"
                    value={newTransfer.reason}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Enter transfer reason"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={initiateTransfer} disabled={processing}>
                  {processing ? 'Processing...' : 'Initiate Transfer'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewTransfer(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transfers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transfers</CardTitle>
            <CardDescription>
              {transfers.length} total transfer{transfers.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transfer.recipient_name}</div>
                        <div className="text-sm text-slate-500">{transfer.recipient_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transfer.bank_name}</div>
                        <div className="text-sm text-slate-500">{transfer.account_number}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₦{transfer.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transfer.status)}>
                        {transfer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(transfer.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {transfer.reference}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TransferPanel;
