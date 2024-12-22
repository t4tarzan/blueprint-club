import { useState, useRef } from 'react';
import { InputWithLabel } from '@/components/shared';
import { defaultHeaders, passwordPolicies } from '@/lib/common';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import * as Yup from 'yup';
import TogglePasswordVisibility from '../shared/TogglePasswordVisibility';
import AgreeMessage from './AgreeMessage';
import GoogleReCAPTCHA from '../shared/GoogleReCAPTCHA';
import ReCAPTCHA from 'react-google-recaptcha';
import { maxLengthPolicies } from '@/lib/common';

interface JoinProps {
  recaptchaSiteKey?: string;
}

const JoinUserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').max(maxLengthPolicies.name),
  email: Yup.string().required('Email is required').email('Invalid email').max(maxLengthPolicies.email),
  password: Yup.string()
    .required('Password is required')
    .min(passwordPolicies.minLength, `Password must be at least ${passwordPolicies.minLength} characters`)
    .max(maxLengthPolicies.password),
  team: Yup.string()
    .required('Team name is required')
    .min(3, 'Team name must be at least 3 characters')
    .max(maxLengthPolicies.team),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

const Join = ({ recaptchaSiteKey }: JoinProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      team: '',
      agreeToTerms: false,
    },
    validationSchema: JoinUserSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: defaultHeaders,
          body: JSON.stringify({
            ...values,
            recaptchaToken,
          }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        toast.success('Account created successfully!');
        router.push('/auth/signin');
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <InputWithLabel
        label="Full Name"
        name="name"
        type="text"
        placeholder="John Doe"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name ? formik.errors.name : undefined}
      />

      <InputWithLabel
        label="Team Name"
        name="team"
        type="text"
        placeholder="Acme Inc"
        value={formik.values.team}
        onChange={formik.handleChange}
        error={formik.touched.team ? formik.errors.team : undefined}
      />

      <InputWithLabel
        label="Email Address"
        name="email"
        type="email"
        placeholder="john@example.com"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email ? formik.errors.email : undefined}
      />

      <div className="relative">
        <InputWithLabel
          label="Password"
          name="password"
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder="••••••••"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password ? formik.errors.password : undefined}
        />
        <div className="absolute right-2 top-9">
          <TogglePasswordVisibility
            isVisible={isPasswordVisible}
            onToggle={handlePasswordVisibility}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={formik.values.agreeToTerms}
          onChange={formik.handleChange}
        />
        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
          <AgreeMessage />
        </label>
      </div>
      {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
        <div className="text-red-500 text-sm mt-1">{formik.errors.agreeToTerms}</div>
      )}

      {recaptchaSiteKey && (
        <GoogleReCAPTCHA
          siteKey={recaptchaSiteKey}
          onChange={(token) => setRecaptchaToken(token || '')}
        />
      )}

      <Button
        type="submit"
        color="primary"
        className="w-full"
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting}
      >
        Create Account
      </Button>
    </form>
  );
};

export default Join;
