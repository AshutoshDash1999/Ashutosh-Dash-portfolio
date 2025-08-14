'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(2000, 'Message must be less than 2000 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type ContactFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Validate form data
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to submit form.',
      success: false,
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  try {
    // Call the API endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        errors: {
          _form: [result.message || 'Failed to submit form. Please try again.'],
        },
        message: 'Failed to submit form. Please try again.',
        success: false,
      };
    }

    if (result.success) {
      // Revalidate the contact page to show success message
      revalidatePath('/#contact');

      return {
        message: "Message sent successfully! I'll get back to you soon.",
        success: true,
      };
    } else {
      return {
        errors: {
          _form: [result.message || 'Failed to submit form. Please try again.'],
        },
        message: 'Failed to submit form. Please try again.',
        success: false,
      };
    }
  } catch (error) {
    console.error('Contact form submission error:', error);

    return {
      errors: {
        _form: ['Something went wrong. Please try again later.'],
      },
      message: 'Something went wrong. Please try again later.',
      success: false,
    };
  }
}

// Alternative server action that can be used directly in forms
export async function processContactForm(formData: FormData): Promise<ContactFormState> {
  return submitContactForm({}, formData);
}
