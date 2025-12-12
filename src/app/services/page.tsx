// import { sanity } from '../../../lib/sanity';
// import { SERVICES_QUERY } from '@/sanity/queries';
import ServicesContent from './services-content';

export const revalidate = 60;

export default async function ServicesPage() {
  // const services = await sanity.fetch(SERVICES_QUERY);
  const services: any[] = [];
  return <ServicesContent services={services} />;
}
