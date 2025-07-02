
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Mail, Calendar, MapPin, Phone, User, DollarSign, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Json } from '@/integrations/supabase/types';
import TransferPanel from './TransferPanel';

interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  package_name: string;
  package_price: number;
  booking_date: string;
  booking_time: string;
  status: string;
  special_requests: string;
  uploaded_images: Json;
  created_at: string;
}

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [view, setView] = useState<'main' | 'bookings' | 'transfers'>('main');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch bookings.",
          variant: "destructive",
        });
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking:', error);
        toast({
          title: "Error",
          description: "Failed to update booking status.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Booking status updated to ${status}.`,
      });

      fetchBookings();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const sendConfirmationEmail = async (booking: Booking) => {
    setSendingEmail(booking.id);
    
    // Simulate sending email (in a real app, you'd implement this with an edge function)
    setTimeout(() => {
      setSendingEmail(null);
      toast({
        title: "Email Sent",
        description: `Confirmation email sent to ${booking.client_email}`,
      });
      
      // Update booking status to confirmed
      if (booking.status === 'pending') {
        updateBookingStatus(booking.id, 'confirmed');
      }
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderUploadedImages = (images: Json) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return null;
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image: any, index: number) => (
          <div key={index} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
            <img 
              src={image.url} 
              alt={`Reference ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  };

  if (view === 'transfers') {
    return <TransferPanel onBack={() => setView('main')} />;
  }

  if (selectedBooking) {
    return (
      <section className="py-8 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedBooking(null)}
              className="mb-4 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookings
            </Button>
            
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Booking Details</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Name</label>
                  <p className="text-slate-800">{selectedBooking.client_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Email</label>
                  <p className="text-slate-800">{selectedBooking.client_email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Session Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Package</label>
                  <p className="text-slate-800">{selectedBooking.package_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Price</label>
                  <p className="text-slate-800 font-semibold">${selectedBooking.package_price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Date & Time</label>
                  <p className="text-slate-800">
                    {format(new Date(selectedBooking.booking_date), 'PPP')} at {selectedBooking.booking_time}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedBooking.special_requests && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{selectedBooking.special_requests}</p>
              </CardContent>
            </Card>
          )}

          {selectedBooking.uploaded_images && Array.isArray(selectedBooking.uploaded_images) && selectedBooking.uploaded_images.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Uploaded Reference Images</CardTitle>
              </CardHeader>
              <CardContent>
                {renderUploadedImages(selectedBooking.uploaded_images)}
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button
                onClick={() => sendConfirmationEmail(selectedBooking)}
                disabled={sendingEmail === selectedBooking.id}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                {sendingEmail === selectedBooking.id ? 'Sending...' : 'Send Confirmation Email'}
              </Button>
              
              <Button
                onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                disabled={selectedBooking.status === 'confirmed'}
                variant="outline"
              >
                Mark as Confirmed
              </Button>
              
              <Button
                onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                disabled={selectedBooking.status === 'completed'}
                variant="outline"
              >
                Mark as Completed
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (view === 'bookings') {
    return (
      <section className="py-8 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setView('main')}
              className="mb-4 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin Panel
            </Button>
            
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Booking Management</h1>
            <p className="text-lg text-slate-600">Manage bookings and client information</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No bookings found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.client_name}</div>
                            <div className="text-sm text-slate-500">{booking.client_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.package_name}</div>
                            <div className="text-sm text-slate-500">₦{(booking.package_price).toLocaleString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</div>
                            <div className="text-sm text-slate-500">{booking.booking_time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => sendConfirmationEmail(booking)}
                              disabled={sendingEmail === booking.id}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              {sendingEmail === booking.id ? 'Sending...' : 'Email'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
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
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-slate-600">Manage your photography business</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('bookings')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                Booking Management
              </CardTitle>
              <CardDescription>
                Manage client bookings, send confirmations, and view session details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-800">{bookings.length}</span>
                <span className="text-sm text-slate-500">Total Bookings</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('transfers')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-green-600" />
                Transfer Management
              </CardTitle>
              <CardDescription>
                Manage Paystack transfers, create recipients, and track payment status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-800">₦</span>
                <span className="text-sm text-slate-500">Paystack Integration</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
