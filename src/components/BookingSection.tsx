import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Upload, Clock, Check, X, Info } from 'lucide-react';
import PaymentPage from './PaymentPage';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';


const BookingSection = ({ selectedPackage, onBack, isAnnual = false, couplesToggle }: { selectedPackage: any; onBack: any; isAnnual?: boolean; couplesToggle: { [key: string]: boolean } }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnnualUpgraded, setIsAnnualUpgraded] = useState(isAnnual);
  const [showUpgradeNotification, setShowUpgradeNotification] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
 
  
  const [formData, setFormData] = useState({
    packageId: selectedPackage?.id || '',
    date: null,
    time: '',
    clientName: '',
    clientEmail: '',
    specialRequests: '',
    uploadedFiles: [],
    uploadedFileUrls: []
  });

  // Evening time slots that trigger annual upgrade (6:00 PM - 10:00 PM)
  const eveningTimeSlots = ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

  // Get the correct price based on billing type and couples toggle
  const getPackagePrice = () => {
    if (!selectedPackage) return 0;
    let basePrice = isAnnualUpgraded ? selectedPackage.annualPrice : selectedPackage.monthlyPrice;
    if (typeof basePrice === 'number' && couplesToggle[selectedPackage.id]) {
      basePrice += 10000;
    }
    return basePrice;
  };

  const steps = [
    { id: 1, title: 'Package & Date', desc: 'Select your session details' },
    { id: 2, title: 'Personal Info', desc: 'Tell us about yourself' },
    { id: 3, title: 'Upload & Notes', desc: 'Share inspiration photos' },
    { id: 4, title: 'Payment', desc: 'Complete your booking' },
    { id: 5, title: 'Review', desc: 'Review your booking' }
  ];

  const timeSlots = [
    '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
  ];

  // Fetch user profile data to auto-populate email
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        // Auto-populate email from user auth only, do not auto-populate name
        setFormData(prev => ({
          ...prev,
          clientEmail: user.email || '',
          clientName: ''
        }));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle time selection with automatic annual upgrade for evening slots
  const handleTimeSelection = (selectedTime) => {
    handleInputChange('time', selectedTime);

    const dayTimeSlots = ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

    if (eveningTimeSlots.includes(selectedTime) && !isAnnualUpgraded) {
      setIsAnnualUpgraded(true);
      setShowUpgradeNotification(true);

      toast({
        title: "Package Upgraded",
        description: "Night Session (6PM–10PM). Price have been updated..",
        duration: 5000,
      });

      // Hide notification after 8 seconds
      setTimeout(() => {
        setShowUpgradeNotification(false);
      }, 8000);
    } else if (dayTimeSlots.includes(selectedTime) && isAnnualUpgraded) {
      setIsAnnualUpgraded(false);
      setShowUpgradeNotification(false);

      toast({
        title: "Package Downgraded",
        description: "Day Session (6PM–10PM). Price have been updated..",
        duration: 5000,
      });
    }
  };

  const handleFileUpload = async (event) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0 || !user) return;

    const files = Array.from(fileList) as File[];
    setIsUploading(true);
    const uploadedUrls = [];
    const uploadedFiles = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('user-uploads')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}. Please try again.`,
            variant: "destructive",
          });
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('user-uploads')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
        uploadedFiles.push({ name: file.name, url: publicUrl });
      }

      handleInputChange('uploadedFiles', [...formData.uploadedFiles, ...uploadedFiles]);
      handleInputChange('uploadedFileUrls', [...formData.uploadedFileUrls, ...uploadedUrls]);

      toast({
        title: "Upload Successful",
        description: `${uploadedFiles.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      console.error('Unexpected upload error:', error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = async (index) => {
    const fileToRemove = formData.uploadedFiles[index];
    
    // Extract the file path from the URL
    const urlParts = fileToRemove.url.split('/');
    const fileName = `${user.id}/${urlParts[urlParts.length - 1]}`;
    
    try {
      // Delete from Supabase storage
      const { error } = await supabase.storage
        .from('user-uploads')
        .remove([fileName]);
      
      if (error) {
        console.error('Delete error:', error);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Remove from local state
    const updatedFiles = formData.uploadedFiles.filter((_, i) => i !== index);
    const updatedUrls = formData.uploadedFileUrls.filter((_, i) => i !== index);
    
    handleInputChange('uploadedFiles', updatedFiles);
    handleInputChange('uploadedFileUrls', updatedUrls);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const isNightSessionNotAvailable = () => {
    if (!selectedPackage) return false;
    if (selectedPackage.id !== 'basic') return false;
    if (!formData.time) return false;
    return eveningTimeSlots.includes(formData.time);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your booking.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!formData.date || !formData.time || !formData.clientName || !formData.clientEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentComplete = async () => {
    toast({
      title: "Payment Completed!",
      description: "Your booking has been processed. You'll receive confirmation once payment is verified.",
    });

    // Reset form and go back to main page
    onBack();
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <section className="py-8 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Authentication Required</h3>
              <p className="text-slate-600 mb-6">Please sign in to book your photography session.</p>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }


  // Show payment page
  if (showPayment) {
    return (
      <section className="py-8 px-4 min-h-screen">
        <PaymentPage
          selectedPackage={selectedPackage}
          bookingDetails={{
            date: formData.date ? format(formData.date, "PPP") : '',
            time: formData.time,
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            specialRequests: formData.specialRequests,
            uploadedFiles: formData.uploadedFiles
          }}
          onBack={() => setShowPayment(false)}
          onPaymentComplete={handlePaymentComplete}
          isAnnual={isAnnualUpgraded}
        />
      </section>
    );
  }

  return (
    <section className="py-8 px-4 min-h-screen overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Book Your Session</h1>
            {selectedPackage && (
              <p className="text-lg text-slate-600">
                {selectedPackage.name} - ₦{getPackagePrice().toLocaleString()}
                {isAnnualUpgraded && !isAnnual && (
                  <span className="ml-2 text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    Upgraded to Night Session
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Upgrade Notification */}
        {showUpgradeNotification && (
          <div className="mb-6">
            <Alert className="border-amber-200 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Night Session (6PM–10PM).price have been updated.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                  currentStep >= step.id 
                    ? 'bg-amber-500 border-amber-500 text-white' 
                    : 'border-slate-300 text-slate-400'
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500">{step.desc}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-amber-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Package & Date */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Session Details</h3>
                  
                  {selectedPackage && (
                    <Card className="bg-amber-50 border-amber-200 mb-6">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">{selectedPackage.name}</h4>
                    <p className="text-sm text-slate-600">{selectedPackage.description}</p>
                    {couplesToggle[selectedPackage.id] ? (
                      <p className="text-sm text-slate-700 font-medium mt-1">Couples Session</p>
                    ) : (
                      <p className="text-sm text-slate-700 font-medium mt-1">Individual Session</p>
                    )}
                    {isAnnualUpgraded && !isAnnual && (
                      <p className="text-xs text-amber-700 mt-1 font-medium">
                        ✨ Upgraded to Night Session for evening time slot
                      </p>
                    )}
                  </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-slate-800">₦{getPackagePrice().toLocaleString()}</div>
                            <div className="text-sm text-slate-500">{selectedPackage.duration}</div>
                            {isAnnualUpgraded && !isAnnual && (
                              <div className="text-xs text-amber-600">Night Session Rate</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium text-slate-700 mb-2 block">
                      Select Date *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12",
                            !formData.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => handleInputChange('date', date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-base font-medium text-slate-700 mb-2 block">
                      Preferred Time *
                    </Label>
                    <Select value={formData.time} onValueChange={handleTimeSelection}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {time}
                              {eveningTimeSlots.includes(time) && (
                                <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                  Night Session
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Information</h3>
                
                <div>
                  <Label className="text-base font-medium text-slate-700 mb-2 block">
                    TikTok / Instagram username
                  </Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="TikTok/Instagram username"
                    className="h-12"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium text-slate-700 mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="your.email@example.com"
                    className="h-12"
                    readOnly
                  />
                </div>
              </div>
            )}

            {/* Step 3: Upload & Notes */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">upload a picture your outfit</h3>
                
                <div>
                  <Label className="text-base font-medium text-slate-700 mb-2 block">
                    Upload Reference Photos (Optional)
                   <br />
                   <span className="text-green-700">note: your location will be based on the uploaded photos</span>
                  </Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      Drag and drop your inspiration photos here, or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <Button asChild variant="outline" disabled={isUploading}>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        {isUploading ? 'Uploading...' : 'Choose Files'}
                      </label>
                    </Button>
                  </div>
                  
                  {formData.uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-3">
                        Uploaded Files ({formData.uploadedFiles.length}):
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {formData.uploadedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                              <img 
                                src={file.url} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-slate-600 mt-1 truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium text-slate-700 mb-2 block">
                    Special Requests or Notes
                  </Label>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Tell us about your vision, any specific shots you want, or special requirements..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Review Your Booking</h3>
                
                {/* Booking Summary */}
                <Card className="bg-slate-50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-slate-800 mb-4">Booking Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="font-medium">
                          {selectedPackage?.name}
                          {isAnnualUpgraded && !isAnnual && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                              Night Session
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">
                          {formData.date ? format(formData.date, "PPP") : 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">
                          {formData.time || 'Not selected'}
                          {formData.time && eveningTimeSlots.includes(formData.time) && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                              Night Session
                            </span>
                          )}
                        </span>
                      </div>
                      {formData.uploadedFiles.length > 0 && (
                        <div className="flex justify-between">
                          <span>Reference Photos:</span>
                          <span className="font-medium">{formData.uploadedFiles.length} uploaded</span>
                        </div>
                      )}
                      <hr className="my-4" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>N{getPackagePrice()}</span>
                      </div>
                      {isAnnualUpgraded && !isAnnual && (
                        <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                          <p className="font-medium">Evening Session Upgrade Applied</p>
                          <p className="text-xs">Night session pricing applied for evening time slot (6PM-10PM)</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Next: Bank Transfer Payment</h4>
                      <p className="text-slate-600 text-sm">
                        After clicking "Proceed to Payment", you'll see our bank account details for direct transfer. 
                        Your booking will be confirmed once payment is received and verified.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6"
              >
                Previous
              </Button>
              
              {currentStep < 4 && !isNightSessionNotAvailable() ? (
                <Button 
                  onClick={nextStep}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6"
                >
                  Next Step
                </Button>
              ) : currentStep < 4 && isNightSessionNotAvailable() ? (
                <div className="text-red-600 font-semibold px-6 py-2">
                  Night session unavailable for this package. please select a different time slot.
                </div>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={false}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8"
                >
                   Proceed to Payment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BookingSection;
