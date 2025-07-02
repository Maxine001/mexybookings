import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PackageSelection from '@/components/PackageSelection';
import BookingSection from '@/components/BookingSection';
import { PhotoPackage } from '@/data/packages';

const Packages = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<PhotoPackage | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [couplesToggle, setCouplesToggle] = useState<{ [key: string]: boolean }>({
    basic: false,
    standard: false,
  });

  const handleSelectPackage = (pkg: PhotoPackage, annual: boolean) => {
    setSelectedPackage(pkg);
    setIsAnnual(annual);
  };

  const handleBackToPackages = () => {
    setSelectedPackage(null);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <>
      {!selectedPackage ? (
        <PackageSelection
          onBack={handleBackToHome}
          onSelectPackage={handleSelectPackage}
          couplesToggle={couplesToggle}
          setCouplesToggle={setCouplesToggle}
        />
      ) : (
        <BookingSection
          selectedPackage={selectedPackage}
          isAnnual={isAnnual}
          onBack={handleBackToPackages}
          couplesToggle={couplesToggle}
        />
      )}
    </>
  );
};

export default Packages;
