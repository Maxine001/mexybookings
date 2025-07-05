import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, AlertCircle, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentPageProps {
  selectedPackage: any;
  bookingDetails: any;
  onBack: () => void;
  onPaymentComplete: () => void;
  isAnnual?: boolean;
}

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.body.appendChild(script);
  });
};

const PaymentPage = ({ selectedPackage, bookingDetails, onBack, onPaymentComplete, isAnnual = false }: PaymentPageProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getPackagePrice = () => {
    if (!selectedPackage) return 0;
    return isAnnual ? selectedPackage.annualPrice : selectedPackage.monthlyPrice;
  };

const initializePayment = async () => {
    // Redirect user directly to Paystack payment page URL to handle payment, receipts, and confirmation
    const paystackPaymentUrl = "https://paystack.shop/pay/rpp0l-t8me"; // Replace with your actual Paystack payment link
    window.location.href = paystackPaymentUrl;
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
        <p className="text-slate-600">Pay securely using Paystack</p>
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

      <Button 
        onClick={initializePayment}
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isSubmitting ? 'Processing Payment...' : 'Pay Now'}
      </Button>
    </div>
  );
};

export default PaymentPage;
