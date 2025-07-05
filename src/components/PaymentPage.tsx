import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, ExternalLink, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface PaymentPageProps {
  selectedPackage: any;
  bookingDetails: any;
  onBack: () => void;
  onPaymentComplete: () => void;
  isAnnual?: boolean;
}

const PaymentPage = ({ selectedPackage, bookingDetails, onBack, onPaymentComplete, isAnnual = false }: PaymentPageProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const getPackagePrice = () => {
    if (!selectedPackage) return 0;
    return isAnnual ? selectedPackage.annualPrice : selectedPackage.monthlyPrice;
  };

const handlePaymentComplete = async () => {
    setIsProcessing(true);
    
    try {
      // Create the booking record with payment_pending status
      // The webhook will update this to 'confirmed' once payment is successful
      const packagePrice = getPackagePrice();

      // Convert booking date to ISO format (YYYY-MM-DD)
      let formattedDate = null;
      if (bookingDetails?.date) {
        const parsedDate = new Date(bookingDetails.date);
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = parsedDate.toISOString().split('T')[0];
        } else {
          // Fallback: try to parse manually if Date constructor fails
          // Remove ordinal suffixes like 'th', 'st', 'nd', 'rd'
          const cleanedDateStr = bookingDetails.date.replace(/(\d+)(st|nd|rd|th)/, '$1');
          const manualParsedDate = new Date(cleanedDateStr);
          if (!isNaN(manualParsedDate.getTime())) {
            formattedDate = manualParsedDate.toISOString().split('T')[0];
          }
        }
      }

      const bookingData = {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        package_id: selectedPackage?.id || 'unknown',
        package_name: selectedPackage?.name || 'Unknown Package',
        package_price: packagePrice,
        booking_date: formattedDate,
        booking_time: bookingDetails?.time,
        client_name: bookingDetails?.clientName || '',
        client_email: bookingDetails?.clientEmail || '',
        special_requests: bookingDetails?.specialRequests || '',
        uploaded_images: bookingDetails?.uploadedFiles || [],
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Booking error:', error);
        toast({
          title: "Booking Creation Failed",
          description: "There was an error creating your booking. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Booking Created!",
        description: "Your booking has been created and is awaiting payment confirmation.",
      });

      // Redirect back to complete the flow
      onPaymentComplete();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Booking Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Booking
        </Button>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Complete Payment</h1>
        <p className="text-slate-600">Complete your payment through Paystack</p>
      </div>

      {/* Booking Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="font-medium">{selectedPackage?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium">{bookingDetails?.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-medium">{bookingDetails?.time}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-green-600">₦{getPackagePrice()?.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Make Payment</CardTitle>
          <CardDescription>Click the link below to pay securely through Paystack</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-green-800 mb-2">Payment Instructions:</h4>
            <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
              <li>Click the payment link below</li>
              <li>Enter the exact amount: ₦{getPackagePrice()?.toLocaleString()}</li>
              <li>Complete your payment on Paystack</li>
              <li>Your booking will be automatically confirmed</li>
            </ol>
          </div>

          <Button
            asChild
            className="w-full bg-green-600 hover:bg-green-700 mb-4"
          >
            <a 
              href="https://paystack.shop/pay/rpp0l-t8me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
              onClick={handlePaymentComplete}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Pay Now - ₦{getPackagePrice()?.toLocaleString()}
            </a>
          </Button>

          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please ensure you pay the exact amount of ₦{getPackagePrice()?.toLocaleString()} to avoid processing issues.
            </AlertDescription>
          </Alert>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your booking will be automatically confirmed once payment is processed by Paystack. You'll receive a confirmation email shortly after payment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
