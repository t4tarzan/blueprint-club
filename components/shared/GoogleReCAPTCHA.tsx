import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface GoogleReCAPTCHAProps {
  siteKey: string | null;
  onChange: (token: string | null) => void;
  recaptchaRef?: React.RefObject<ReCAPTCHA>;
}

const GoogleReCAPTCHA: React.FC<GoogleReCAPTCHAProps> = ({ 
  siteKey,
  onChange,
  recaptchaRef
}) => {
  if (!siteKey) return null;

  return (
    <div className="flex justify-center mt-4">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={onChange}
      />
    </div>
  );
};

export default GoogleReCAPTCHA;
