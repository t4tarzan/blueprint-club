import { useState, useRef } from 'react';
import { InputWithLabel } from '@/components/shared';
import { defaultHeaders, passwordPolicies } from '@/lib/common';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse, ApiError } from 'types';
import * as Yup from 'yup';
import TogglePasswordVisibility from '../shared/TogglePasswordVisibility';
import AgreeMessage from './AgreeMessage';
import GoogleReCAPTCHA from '../shared/GoogleReCAPTCHA';
import ReCAPTCHA from 'react-google-recaptcha';
import { maxLengthPolicies } from '@/lib/common';

interface JoinProps {
  recaptchaSiteKey: string;
}

interface JoinFormValues {
  name: string;
  email: string;
  password: string;
  team: string;
  agreeToTerms: boolean;
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
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const formik = useFormik<JoinFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      team: '',
      agreeToTerms: false,
    },
    validationSchema: JoinUserSchema,
    onSubmit: async (values) => {
      if (!recaptchaToken) {
        toast.error('Please complete the reCAPTCHA');
        return;
      }

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
          // Extract error message safely
          const errorMessage = typeof data.error === 'object' && data.error?.message 
            ? data.error.message 
            : data.message || 'Something went wrong';
          throw new Error(errorMessage);
        }

        toast.success(t('account-created-successfully'));
        router.push('/auth/signin');
      } catch (error) {
        console.error('Registration error:', error);
        toast.error(error instanceof Error ? error.message : t('something-went-wrong'));
      }
    },
  });

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <InputWithLabel
        label={t('full-name')}
        name="name"
        type="text"
        placeholder={t('full-name-placeholder')}
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name ? formik.errors.name : undefined}
      />

      <InputWithLabel
        label={t('team-name')}
        name="team"
        type="text"
        placeholder={t('team-name-placeholder')}
        value={formik.values.team}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.team ? formik.errors.team : undefined}
      />

      <InputWithLabel
        label={t('email-address')}
        name="email"
        type="email"
        placeholder={t('email-placeholder')}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email ? formik.errors.email : undefined}
      />

      <div className="relative">
        <InputWithLabel
          label={t('password')}
          name="password"
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder="••••••••"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password ? formik.errors.password : undefined}
        />
        <div className="absolute right-2 top-9">
          <TogglePasswordVisibility
            isPasswordVisible={isPasswordVisible}
            onTogglePasswordVisibility={handlePasswordVisibility}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          checked={formik.values.agreeToTerms}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
          <AgreeMessage action={t('join')} />
        </label>
      </div>
      {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
        <div className="text-red-500 text-sm mt-1">{formik.errors.agreeToTerms}</div>
      )}

      {recaptchaSiteKey && (
        <GoogleReCAPTCHA
          siteKey={recaptchaSiteKey}
          onChange={handleRecaptchaChange}
          recaptchaRef={recaptchaRef}
        />
      )}

      <Button
        type="submit"
        color="primary"
        className="w-full"
        disabled={!formik.isValid || formik.isSubmitting || !recaptchaToken}
      >
        {formik.isSubmitting ? t('creating-account') : t('create-account')}
      </Button>
    </form>
  );
};

export default Join;
