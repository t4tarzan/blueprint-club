import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { InputWithLabel } from '../shared/InputWithLabel';

interface LoginProps {
  csrfToken?: string;
  callbackUrl?: string;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const Login = ({ csrfToken, callbackUrl = '/dashboard' }: LoginProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setError(null);

      try {
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
          callbackUrl,
        });

        if (result?.error) {
          setError(result.error);
          return;
        }

        if (!result?.ok) {
          setError('Failed to sign in. Please try again.');
          return;
        }

        if (result.url) {
          router.push(result.url);
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        
        <InputWithLabel
          label={t('email')}
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email ? formik.errors.email : undefined}
          required
        />

        <InputWithLabel
          label={t('password')}
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password ? formik.errors.password : undefined}
          required
        />

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link 
              href="/auth/forgot-password" 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t('forgot-password')}
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? t('signing-in') : t('sign-in')}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">{t('or')}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('dont-have-account')}{' '}
              <Link 
                href="/auth/join" 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {t('sign-up')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
