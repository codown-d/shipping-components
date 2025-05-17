import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from '@shopify/polaris';

import TextField from '../../../components/FormFields/TextField';
import Select from '../../../components/FormFields/Select';
import { EasyshipAccountFormData } from '../types';

import styles from './ContactInfoForm.module.scss';

interface ContactInfoFormProps {
  defaultValues?: Partial<EasyshipAccountFormData>;
  onSubmit: (data: EasyshipAccountFormData) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ defaultValues, onSubmit }) => {
  const methods = useForm<EasyshipAccountFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      companyName: '',
      country: 'CHN',
      ...defaultValues,
    },
  });

  // 国家/地区选项
  const countryOptions = [
    { label: 'China', value: 'CHN' },
    { label: 'United States', value: 'USA' },
    { label: 'Hong Kong', value: 'HKG' },
    { label: 'Singapore', value: 'SGP' },
    { label: 'United Kingdom', value: 'GBR' },
    // 可以根据需要添加更多国家
  ];

  return (
    <FormProvider {...methods}>
      <form className={styles.container} onSubmit={methods.handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <div className={styles.field}>
            <TextField
              name="firstName"
              label="First name"
              autoComplete="given-name"
              error={methods.formState.errors.firstName?.message}
              required
            />
          </div>
          <div className={styles.field}>
            <TextField
              name="lastName"
              label="Last name"
              autoComplete="family-name"
              error={methods.formState.errors.lastName?.message}
              required
            />
          </div>
        </div>

        <TextField
          name="email"
          label="Email"
          autoComplete="email"
          error={methods.formState.errors.email?.message}
          required
        />

        <div className={styles.row}>
          <div className={styles.field}>
            <TextField
              name="companyName"
              label="Company Name (optional)"
              autoComplete="organization"
              error={methods.formState.errors.companyName?.message}
            />
          </div>
          <div className={styles.field}>
            <Select
              name="country"
              label="Country/region"
              options={countryOptions}
              error={methods.formState.errors.country?.message}
              required
            />
          </div>
        </div>

        <div className={styles.termsContainer}>
          <p className={styles.termsText}>
            By creating an account, you agree to the Easyship{' '}
            <Link url="https://www.easyship.com/terms-of-service" external>
              Terms of Service
            </Link>
            , and{' '}
            <Link url="https://www.easyship.com/privacy-policy" external>
              Privacy & Data Protection Policy
            </Link>
            .
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default ContactInfoForm;
