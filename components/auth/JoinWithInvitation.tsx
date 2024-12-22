import {
  Error,
  InputWithLabel,
  Loading,
  WithLoadingAndError,
} from '@/components/shared';
import {
  defaultHeaders,
  maxLengthPolicies,
  passwordPolicies,
} from '@/lib/common';
import { useFormik } from 'formik';
import useInvitation from 'hooks/useInvitation';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import * as Yup from 'yup';
import TogglePasswordVisibility from '../shared/TogglePasswordVisibility';
import { useRef, useState } from 'react';
import AgreeMessage from './AgreeMessage';
import GoogleReCAPTCHA from '../shared/GoogleReCAPTCHA';
import ReCAPTCHA from 'react-google-recaptcha';

interface JoinWithInvitationProps {
  inviteToken: string;
  recaptchaSiteKey: string | null;
}

interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
  };
}

const JoinUserSchema = Yup.object().shape({
  name: Yup.string().required().max(maxLengthPolicies.name),
  password: Yup.string()
    .required()
    .min(passwordPolicies.minLength)
    .max(maxLengthPolicies.password),
  sentViaEmail: Yup.boolean().required(),
  email: Yup.string()
    .max(maxLengthPolicies.email)
    .when('sentViaEmail', {
      is: false,
      then: (schema) => schema.required().email().max(maxLengthPolicies.email),
    }),
});

const JoinWithInvitation = ({
  inviteToken,
  recaptchaSiteKey,
}: JoinWithInvitationProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { isLoading, error: invitationError, invitation, invitationDetails } = useInvitation();
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: invitationDetails?.email || '',
      password: '',
      sentViaEmail: invitationDetails?.sentViaEmail ?? true,
    },
    validationSchema: JoinUserSchema,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/auth/join', {
          method: 'POST',
          headers: defaultHeaders,
          body: JSON.stringify({
            ...values,
            recaptchaToken,
            inviteToken,
          }),
        });

        const json = await response.json();

        if (!response.ok) {
          // Type guard for error response
          if (json && typeof json === 'object' && 'error' in json && 
              typeof json.error === 'object' && json.error && 
              'message' in json.error && typeof json.error.message === 'string') {
            toast.error(json.error.message);
          } else {
            toast.error('Failed to join. Please try again.');
          }
          return;
        }

        toast.success(t('successfully-joined'));
        router.push('/auth/signin');
      } catch (error) {
        console.error('Join error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    },
  });

  if (isLoading) {
    return <Loading message={t('loading-invitation')} />;
  }

  if (invitationError) {
    return <Error message={invitationError} />;
  }

  if (!invitationDetails) {
    return <Error message={t('invalid-invitation')} />;
  }

  return (
    <WithLoadingAndError loading={isLoading} error={invitationError}>
      <form className="space-y-3" onSubmit={formik.handleSubmit}>
        <InputWithLabel
          type="text"
          label={t('name')}
          name="name"
          placeholder={t('enter-name')}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name ? formik.errors.name : undefined}
        />

        {invitationDetails?.sentViaEmail ? (
          <InputWithLabel
            type="email"
            label={t('email')}
            name="email"
            placeholder={t('enter-email')}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email ? formik.errors.email : undefined}
            disabled
          />
        ) : (
          <InputWithLabel
            type="email"
            label={t('email')}
            name="email"
            placeholder={t('enter-email')}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email ? formik.errors.email : undefined}
          />
        )}

        <div className="relative flex">
          <InputWithLabel
            type={isPasswordVisible ? 'text' : 'password'}
            label={t('password')}
            name="password"
            placeholder={t('enter-password')}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password ? formik.errors.password : undefined}
          />
          <TogglePasswordVisibility
            isPasswordVisible={isPasswordVisible}
            handlePasswordVisibility={handlePasswordVisibility}
          />
        </div>
        {recaptchaSiteKey && (
          <GoogleReCAPTCHA
            siteKey={recaptchaSiteKey}
            onChange={setRecaptchaToken}
            recaptchaRef={recaptchaRef}
          />
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            color="primary"
            loading={formik.isSubmitting}
            active={formik.dirty}
            fullWidth
            size="md"
          >
            {t('create-account')}
          </Button>
          <AgreeMessage text={t('create-account')} />
        </div>
      </form>
    </WithLoadingAndError>
  );
};

export default JoinWithInvitation;
