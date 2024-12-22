import { FC } from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

const JsonLd: FC<JsonLdProps> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export const OrganizationSchema = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Blueprint Club',
    url: 'https://blueprintclub.com',
    logo: 'https://blueprintclub.com/images/logo.png',
    description: 'Empowering Education & Professional Development',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://facebook.com/blueprintclub',
      'https://twitter.com/blueprintclub',
      'https://instagram.com/blueprintclub',
      'https://linkedin.com/company/blueprintclub'
    ],
    offers: [
      {
        '@type': 'Offer',
        category: 'Professional Development',
        name: 'BPC Adults',
        description: 'Professional development programs for adults'
      },
      {
        '@type': 'Offer',
        category: 'K-12 Education',
        name: 'BPC Schooling',
        description: 'Comprehensive K-12 education programs'
      },
      {
        '@type': 'Offer',
        category: 'After School',
        name: 'BPCAS',
        description: 'After-school enrichment programs'
      },
      {
        '@type': 'Offer',
        category: 'Technical Training',
        name: 'BPC Academy',
        description: 'Technical and professional certification programs'
      }
    ]
  };

  return <JsonLd data={data} />;
};

export const CourseSchema = ({
  name,
  description,
  provider = 'Blueprint Club',
  courseCode,
  startDate,
  endDate,
  price,
  priceCurrency = 'INR'
}) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: 'https://blueprintclub.com'
    },
    ...(courseCode && { courseCode }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency
      }
    })
  };

  return <JsonLd data={data} />;
};

export const FAQSchema = ({ questions }) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  };

  return <JsonLd data={data} />;
};

export default JsonLd;
