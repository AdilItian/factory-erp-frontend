import { z } from 'zod';

function getFieldSchema(field) {
  const { type, label, required = true } = field;
  const requiredMessage = `${label} is required`;

  switch (type) {
    case 'email':
      return required
        ? z.string().min(1, requiredMessage).email('Enter a valid email address')
        : z.string().email('Enter a valid email address').or(z.literal(''));

    case 'number':
      if (required) {
        return z.coerce.number({ invalid_type_error: `${label} must be a number` });
      }
      return z
        .union([
          z.literal(''),
          z.coerce.number({ invalid_type_error: `${label} must be a number` })
        ])
        .optional();

    case 'password': {
      let schema = required
        ? z.string().min(1, requiredMessage)
        : z.string().optional();

      if (field.minLength) {
        schema = schema.min(
          field.minLength,
          `${label} must be at least ${field.minLength} characters`
        );
      }

      return schema;
    }

    case 'checkbox':
      return required
        ? z.boolean().refine((value) => value === true, requiredMessage)
        : z.boolean();

    case 'file':
      if (field.multiple) {
        return required
          ? z.array(z.instanceof(File)).min(1, requiredMessage)
          : z.array(z.instanceof(File)).optional();
      }
      return required
        ? z.instanceof(File, { message: requiredMessage })
        : z.instanceof(File).nullable().optional();

    case 'select':
      return required
        ? z.string().min(1, requiredMessage)
        : z.string().optional();

    default:
      return required
        ? z.string().min(1, requiredMessage)
        : z.string().optional();
  }
}

export function buildFormSchema(fields) {
  const shape = {};

  for (const field of fields) {
    shape[field.name] = getFieldSchema(field);
  }

  return z.object(shape);
}

export function buildDefaultValues(fields) {
  return fields.reduce((acc, field) => {
    if (field.defaultValue !== undefined) {
      acc[field.name] = field.defaultValue;
      return acc;
    }

    if (field.type === 'checkbox') {
      acc[field.name] = false;
      return acc;
    }

    if (field.type === 'file') {
      acc[field.name] = field.multiple ? [] : null;
      return acc;
    }

    if (field.type === 'number') {
      acc[field.name] = '';
      return acc;
    }

    acc[field.name] = '';
    return acc;
  }, {});
}
