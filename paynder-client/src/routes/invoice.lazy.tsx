import { createLazyFileRoute } from '@tanstack/react-router'
import InvoiceGenerator from '../components/invoice-generator'

export const Route = createLazyFileRoute('/invoice')({
  component: InvoiceGenerator,
});
