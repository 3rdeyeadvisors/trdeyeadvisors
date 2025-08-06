
/**
 * SEO Automation Component
 * Automatically applies SEO optimization to any page
 */

import { Helmet } from "react-helmet-async";
import { useSEOAutomation, type SEOAutomationOptions } from "@/hooks/useSEOAutomation";

interface SEOAutomationProps extends SEOAutomationOptions {
  children?: React.ReactNode;
  showReport?: boolean;
}

/**
 * Main SEO Automation Component
 * Use this instead of the manual SEO component for automatic optimization
 */
const SEOAutomation = ({ 
  showReport = false, 
  children,
  ...options 
}: SEOAutomationProps) => {
  const { 
    seoConfig, 
    schema, 
    faqSchema, 
    validation, 
    report, 
    isLoading 
  } = useSEOAutomation(options);

  if (isLoading) {
    return null; // Don't render anything while loading
  }

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
        <link rel="canonical" href={seoConfig.url} />
        
        {/* AI Crawler Optimization */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph Tags */}
        <meta property="og:title" content={seoConfig.title} />
        <meta property="og:description" content={seoConfig.description} />
        <meta property="og:type" content={seoConfig.type || 'website'} />
        <meta property="og:url" content={seoConfig.url} />
        <meta property="og:image" content={`${window.location.origin}/social-share-3rdeyeadvisors-new.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="3rdeyeadvisors" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoConfig.title} />
        <meta name="twitter:description" content={seoConfig.description} />
        <meta name="twitter:image" content={`${window.location.origin}/social-share-3rdeyeadvisors-new.jpg`} />
        <meta name="twitter:creator" content="@3rdeyeadvisors" />
        <meta name="twitter:site" content="@3rdeyeadvisors" />

        {/* Schema.org Structured Data */}
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": schema.type,
                name: seoConfig.title,
                description: seoConfig.description,
                url: seoConfig.url,
                image: `${window.location.origin}/social-share-3rdeyeadvisors-new.jpg`,
                publisher: {
                  "@type": "Organization",
                  name: "3rdeyeadvisors",
                  url: "https://the3rdeyeadvisors.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://the3rdeyeadvisors.com/favicon-3ea-new.png"
                  }
                },
                ...schema.data
              }) 
            }}
          />
        )}

        {/* FAQ Schema */}
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": faqSchema.type,
                ...faqSchema.data
              }) 
            }}
          />
        )}
      </Helmet>

      {/* Development SEO Report */}
      {showReport && process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className={`p-4 rounded-lg shadow-lg ${
            report.status === 'pass' ? 'bg-green-100 border-green-500' :
            report.status === 'warning' ? 'bg-yellow-100 border-yellow-500' :
            'bg-red-100 border-red-500'
          } border`}>
            <h4 className="font-bold text-sm mb-2">SEO Automation Report</h4>
            <p className="text-xs mb-2">{report.summary}</p>
            {report.details.length > 0 && (
              <ul className="text-xs space-y-1">
                {report.details.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {children}
    </>
  );
};

/**
 * Pre-configured automation for blog posts
 */
export const BlogSEOAutomation = ({ 
  title, 
  excerpt, 
  author, 
  publishedDate, 
  category, 
  tags, 
  children 
}: {
  title: string;
  excerpt?: string;
  author?: string;
  publishedDate: string;
  category: string;
  tags: string[];
  children?: React.ReactNode;
}) => (
  <SEOAutomation
    title={title}
    description={excerpt}
    author={author}
    publishedDate={publishedDate}
    category={category}
    tags={tags}
  >
    {children}
  </SEOAutomation>
);

/**
 * Pre-configured automation for courses
 */
export const CourseSEOAutomation = ({ 
  title, 
  description, 
  price, 
  level, 
  topics, 
  children 
}: {
  title: string;
  description?: string;
  price?: number;
  level?: string;
  topics?: string[];
  children?: React.ReactNode;
}) => (
  <SEOAutomation
    title={title}
    description={description}
    price={price}
    category="DeFi Course"
    tags={[
      'DeFi course',
      'crypto education',
      'blockchain learning',
      ...(topics || []),
      level || 'beginner'
    ]}
  >
    {children}
  </SEOAutomation>
);

/**
 * Pre-configured automation for products
 */
export const ProductSEOAutomation = ({ 
  title, 
  description, 
  price, 
  category, 
  features, 
  children 
}: {
  title: string;
  description?: string;
  price: number;
  category: string;
  features?: string[];
  children?: React.ReactNode;
}) => (
  <SEOAutomation
    title={title}
    description={description}
    price={price}
    category={category}
    tags={[
      'DeFi tool',
      'crypto product',
      'financial calculator',
      ...(features || [])
    ]}
  >
    {children}
  </SEOAutomation>
);

export default SEOAutomation;
