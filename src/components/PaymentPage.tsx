
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Copy, CheckCircle, AlertCircle, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentPageProps {
  selectedPackage: any;
  bookingDetails: any;
  onBack: () => void;
  onPaymentComplete: () => void;
  isAnnual?: boolean;
}

const PaymentPage = ({ selectedPackage, bookingDetails, onBack, onPaymentComplete, isAnnual = false }: PaymentPageProps) => {
  const [paymentProof, setPaymentProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Your account details - replace with your actual details
  const accountDetails = {
    accountName: "Samuel Agbo Ekere",
    accountNumber: "1234567890",
    bankName: "Access Bank",
    bankCode: "044"
  };

  const getPackagePrice = () => {
    if (!selectedPackage) return 0;
    return isAnnual ? selectedPackage.annualPrice : selectedPackage.monthlyPrice;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    });
  };

  const handlePaymentSubmit = async () => {
    if (!paymentProof.trim()) {
      toast({
        title: "Payment Proof Required",
        description: "Please enter your payment reference or transaction ID",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate payment verification - in real app, you'd verify with Paystack
    setTimeout(() => {
      toast({
        title: "Payment Submitted",
        description: "Your payment proof has been submitted for verification. You'll receive confirmation shortly.",
      });
      onPaymentComplete();
      setIsSubmitting(false);
    }, 2000);
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
        <p className="text-slate-600">Transfer payment to complete your booking</p>
      </div>

      {/* Booking Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Banknote className="w-5 h-5 mr-2" />
            Payment Summary
          </CardTitle>
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
          <CardTitle>Bank Transfer Details</CardTitle>
          <CardDescription>Transfer the exact amount to the account below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please transfer the exact amount of ₦{getPackagePrice()?.toLocaleString()} to secure your booking.
            </AlertDescription>
          </Alert>

          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-sm text-slate-600">Account Name</Label>
                <p className="font-semibold">{accountDetails.accountName}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(accountDetails.accountName, 'Account name')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <Label className="text-sm text-slate-600">Account Number</Label>
                <p className="font-semibold text-lg">{accountDetails.accountNumber}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(accountDetails.accountNumber, 'Account number')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <Label className="text-sm text-slate-600">Bank Name</Label>
                <p className="font-semibold">{accountDetails.bankName}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(accountDetails.bankName, 'Bank name')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <Label className="text-sm text-slate-600">Amount</Label>
                <p className="font-semibold text-lg text-green-600">₦{getPackagePrice()?.toLocaleString()}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(getPackagePrice()?.toString() || '', 'Amount')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              After making the transfer, enter your transaction reference below to confirm payment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Payment Proof */}
      <Card>
        <CardHeader>
          <CardTitle>Confirm Payment</CardTitle>
          <CardDescription>Enter your transaction reference or payment proof</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="payment-proof">Transaction Reference / Payment ID</Label>
            <Input
              id="payment-proof"
              value={paymentProof}
              onChange={(e) => setPaymentProof(e.target.value)}
              placeholder="Enter transaction reference (e.g., TXN123456789)"
              className="mt-2"
            />
          </div>

          <Button 
            onClick={handlePaymentSubmit}
            disabled={isSubmitting || !paymentProof.trim()}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Verifying Payment...' : 'Confirm Payment'}
          </Button>

          <p className="text-sm text-slate-500 text-center">
            Your booking will be confirmed once payment is verified (usually within 1-2 hours)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
