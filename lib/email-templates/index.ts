import { render } from '@react-email/render';
import { QuoteCustomerConfirmationEmail } from './QuoteCustomerConfirmation';
import { QuoteAdminNotificationEmail } from './QuoteAdminNotification';
import { ContactCustomerConfirmationEmail } from './ContactCustomerConfirmation';
import { ContactAdminNotificationEmail } from './ContactAdminNotification';
import { BookingReminderEmail } from './BookingReminderEmail';
import { TripUpdateEmail } from './TripUpdateEmail';
import { NewBookingNotificationEmail } from './NewBookingNotificationEmail';
import { NewsletterWelcomeEmail } from './NewsletterWelcomeEmail';
import { NewTripAnnouncementEmail } from './NewTripAnnouncementEmail';
import { ClientWelcomeEmail } from './ClientWelcomeEmail';

// Quote Customer Confirmation

interface QuoteCustomerConfirmationProps {
  customerName: string;
  tripTitle: string;
}

export async function quoteCustomerConfirmationHtml(
  props: QuoteCustomerConfirmationProps
): Promise<string> {
  return render(QuoteCustomerConfirmationEmail(props));
}

export async function quoteCustomerConfirmationText(
  props: QuoteCustomerConfirmationProps
): Promise<string> {
  return render(QuoteCustomerConfirmationEmail(props), { plainText: true });
}

// Quote Admin Notification

interface QuoteAdminNotificationProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  tripTitle: string;
  tripId: string;
  travelDate?: string;
  adults: number;
  children: number;
  message?: string;
  quoteId: string;
}

export async function quoteAdminNotificationHtml(
  props: QuoteAdminNotificationProps
): Promise<string> {
  return render(QuoteAdminNotificationEmail(props));
}

export async function quoteAdminNotificationText(
  props: QuoteAdminNotificationProps
): Promise<string> {
  return render(QuoteAdminNotificationEmail(props), { plainText: true });
}

// Contact Customer Confirmation

interface ContactCustomerConfirmationProps {
  name: string;
}

export async function contactCustomerConfirmationHtml(
  props: ContactCustomerConfirmationProps
): Promise<string> {
  return render(ContactCustomerConfirmationEmail(props));
}

export async function contactCustomerConfirmationText(
  props: ContactCustomerConfirmationProps
): Promise<string> {
  return render(ContactCustomerConfirmationEmail(props), { plainText: true });
}

// Contact Admin Notification

interface ContactAdminNotificationProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
  messageId: string;
}

export async function contactAdminNotificationHtml(
  props: ContactAdminNotificationProps
): Promise<string> {
  return render(ContactAdminNotificationEmail(props));
}

export async function contactAdminNotificationText(
  props: ContactAdminNotificationProps
): Promise<string> {
  return render(ContactAdminNotificationEmail(props), { plainText: true });
}

// Booking Reminder

interface BookingReminderProps {
  customerName: string;
  tripTitle: string;
  completionUrl: string;
}

export async function bookingReminderHtml(
  props: BookingReminderProps
): Promise<string> {
  return render(BookingReminderEmail(props));
}

export async function bookingReminderText(
  props: BookingReminderProps
): Promise<string> {
  return render(BookingReminderEmail(props), { plainText: true });
}

// Trip Update

interface TripUpdateProps {
  customerName: string;
  tripTitle: string;
  subject: string;
  messageBody: string;
}

export async function tripUpdateHtml(
  props: TripUpdateProps
): Promise<string> {
  return render(TripUpdateEmail(props));
}

export async function tripUpdateText(
  props: TripUpdateProps
): Promise<string> {
  return render(TripUpdateEmail(props), { plainText: true });
}

// New Booking Notification

interface NewBookingNotificationProps {
  customerName: string;
  customerEmail: string;
  tripTitle: string;
  tripId: string;
  passengers: number;
  totalPrice: number;
  currency: string;
  travelDate?: string;
  bookingId: string;
  withPayment: boolean;
}

export async function newBookingNotificationHtml(
  props: NewBookingNotificationProps
): Promise<string> {
  return render(NewBookingNotificationEmail(props));
}

export async function newBookingNotificationText(
  props: NewBookingNotificationProps
): Promise<string> {
  return render(NewBookingNotificationEmail(props), { plainText: true });
}

// Newsletter Welcome

interface NewsletterWelcomeProps {
  name?: string;
}

export async function newsletterWelcomeHtml(
  props: NewsletterWelcomeProps = {}
): Promise<string> {
  return render(NewsletterWelcomeEmail(props));
}

export async function newsletterWelcomeText(
  props: NewsletterWelcomeProps = {}
): Promise<string> {
  return render(NewsletterWelcomeEmail(props), { plainText: true });
}

// New Trip Announcement

interface NewTripAnnouncementProps {
  tripTitle: string;
  tripId: string;
  subtitle?: string;
}

export async function newTripAnnouncementHtml(
  props: NewTripAnnouncementProps
): Promise<string> {
  return render(NewTripAnnouncementEmail(props));
}

export async function newTripAnnouncementText(
  props: NewTripAnnouncementProps
): Promise<string> {
  return render(NewTripAnnouncementEmail(props), { plainText: true });
}

// Client Welcome

interface ClientWelcomeProps {
  name?: string;
}

export async function clientWelcomeHtml(
  props: ClientWelcomeProps = {}
): Promise<string> {
  return render(ClientWelcomeEmail(props));
}

export async function clientWelcomeText(
  props: ClientWelcomeProps = {}
): Promise<string> {
  return render(ClientWelcomeEmail(props), { plainText: true });
}
