import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'next-i18next';
import type { ApiErrorResponse } from '../../types';
import { InputWithLabel } from '../shared/InputWithLabel';

interface CreateTeamFormProps {
  onSuccess?: () => void;
}

interface CreateTeamResponse {
  slug: string;
  [key: string]: unknown;
}

interface CreateTeamValues {
  name: string;
  domain?: string;
}

const createTeamSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Team name must be at least 2 characters')
    .max(50, 'Team name must be less than 50 characters')
    .required('Team name is required'),
  domain: Yup.string()
    .matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/, 'Invalid domain format')
    .optional(),
});

export function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [error, setError] = useState('');

  const formik = useFormik<CreateTeamValues>({
    initialValues: {
      name: '',
      domain: '',
    },
    validationSchema: createTeamSchema,
    onSubmit: async (values) => {
      setError('');

      try {
        const response = await fetch('/api/teams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name,
            domain: values.domain || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorResponse = data as ApiErrorResponse;
          throw new Error(
            errorResponse.error?.message || 
            errorResponse.message || 
            'Failed to create team'
          );
        }

        const team = data as CreateTeamResponse;
        
        if (!team.slug) {
          throw new Error('Invalid team response: missing slug');
        }

        onSuccess?.();
        router.push(`/teams/${team.slug}/settings`);
      } catch (err) {
        console.error('Error creating team:', err);
        setError(err instanceof Error ? err.message : 'Failed to create team');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <InputWithLabel
        label={t('team-name')}
        type="text"
        id="name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name ? formik.errors.name : undefined}
        required
        placeholder={t('enter-team-name')}
      />

      <InputWithLabel
        label={t('domain')}
        type="text"
        id="domain"
        name="domain"
        value={formik.values.domain}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.domain ? formik.errors.domain : undefined}
        placeholder="company.com"
        helpText={t('domain-help-text')}
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

      <div>
        <button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? t('creating') : t('create-team')}
        </button>
      </div>
    </form>
  );
}
