import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface GoogleReCAPTCHAProps {
  siteKey: string | null;
  onVerify: (token: string) => void;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
}

const GoogleReCAPTCHA = ({ siteKey, onVerify, recaptchaRef }: GoogleReCAPTCHAProps) => {
  if (!siteKey) return null;

  return (
    <div className="flex justify-center mt-4">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={(token) => token && onVerify(token)}
      />
    </div>
  );
};

export default GoogleReCAPTCHA;
