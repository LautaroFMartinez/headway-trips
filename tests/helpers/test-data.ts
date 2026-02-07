export const contactFormData = {
  valid: {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+54 11 1234-5678',
    message: 'Hola, me interesa el viaje a Bariloche para febrero.',
  },
  invalidEmail: {
    name: 'Test User',
    email: 'invalid-email',
    phone: '',
    message: 'Este es un mensaje de prueba con más de diez caracteres.',
  },
};

export const newsletterData = {
  validEmail: 'test@example.com',
  invalidEmail: 'not-an-email',
};

export const adminCredentials = {
  valid: {
    email: 'admin@headwaytrips.com',
    password: 'admin-password-123',
  },
  invalid: {
    email: 'wrong@example.com',
    password: 'wrong-password',
  },
};

export const apiResponses = {
  contact: {
    success: {
      success: true,
      message: 'Message sent successfully',
      data: { id: 'test-uuid-123' },
    },
    validationError: {
      error: 'Validation error',
      details: [{ field: 'email', message: 'Email inválido' }],
    },
    serverError: {
      error: 'Error interno del servidor',
    },
  },
  newsletter: {
    success: {
      success: true,
      message: 'Suscripción exitosa',
    },
    duplicate: {
      error: 'Este email ya está suscrito',
    },
  },
  adminLogin: {
    success: {
      success: true,
      admin: { id: 'admin-uuid', email: 'admin@headwaytrips.com' },
    },
    invalidCredentials: {
      error: 'Credenciales inválidas',
    },
  },
  adminSession: {
    authenticated: {
      authenticated: true,
      admin: { id: 'admin-uuid', email: 'admin@headwaytrips.com' },
    },
    unauthenticated: {
      authenticated: false,
    },
  },
};
